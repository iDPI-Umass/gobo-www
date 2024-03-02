import * as Value from "@dashkite/joy/value";
import * as Type from "@dashkite/joy/type";
import * as linkify from "linkifyjs";
import * as LS from "$lib/helpers/local-storage.js";
import * as Post from "$lib/resources/post.js";
import * as FeedSaver from "$lib/engines/feed-singleton.js";
import { draftStores } from "$lib/stores/draft.js";

let singletonDraft;

const Draft = {
  make: () => {
    return {
      alert: null,
      identities: [],
      attachments: [],
      options: {
        spoiler: false,
        spoilerText: null,
        sensitive: false,
        visibility: "public",
        title: null,
        subreddit: null
      },
      content: null,
      reply: null,
      quote: null
    };
  },

  read: () => {
    if ( singletonDraft == null ) {
      let draft = LS.read( "gobo-draft" );
      if ( draft == null ) {
        draft = Draft.make();
      }
      draft.identities ??= [];
      draft.attachments ??= [];
      singletonDraft = draft;
    }
    
    return singletonDraft;
  },

  write: () => LS.write( "gobo-draft", singletonDraft ),


  // Handle broadcast and listening coordination among components.
  subscribe: ( store, f ) => draftStores[ store ].subscribe( f ),
  put: ( store, value ) =>  draftStores[ store ].put( value ),
  
  // Which brings us to a widefield broadcast function to make sure everyone
  // has the latest data. Useful at the page level and for broad changes.
  load: () => {
    const draft = Draft.read();
    Draft.put( "content", draft );
    Draft.put( "identities", draft );
    Draft.put( "reply", draft );
    Draft.put( "quote", draft );
    Draft.put( "options", draft );
    return draft;
  },


  clear: () => {
    singletonDraft = Draft.make();
    Draft.write();
    Draft.load();
  },
  update: ( data ) => {
    const draft = Draft.read();
    Object.assign( draft, data );
    Draft.write();
    Draft.load();
  },
  updateAspect: ( aspect, value ) => {
    const draft = Draft.read();
    Object.assign( draft, { [aspect]: value });
    Draft.write();
    Draft.put( aspect, draft );
  },


  loadReply: async () => {
    let { reply } = Draft.read();
    if ( reply == null ) {
      return;
    }
    reply.data = await Post.get( reply );
    Draft.updateAspect( "reply", reply );
  },

  loadQuote: async () => {
    let { quote } = Draft.read();
    if ( quote == null ) {
      return;
    }
    quote.data = await Post.get( quote );
    Draft.updateAspect( "quote", quote );
  },

  publish: Post.publish,

  // This is unfortunately hacky. For replies and quotes, the post data is
  // stowed in the draft store, including local storage. However, on page
  // reloads, the memory cache of the any resource in the graph connected to
  // that post is lost. This speaks to a need for a component-centered
  // realignment that can use fine-grained HTTP caching. But there's some
  // awkwardness from Svelte and time constraints. The more simple solution
  // for now is to prune the cached graph data from the draft, forcing the
  // component to wait for the application cache to be authoritative.
  pruneGraph: () => {
    const { reply, quote } = Draft.read();
    if ( reply != null ) {
      reply.data = null;
      Draft.updateAspect( "reply", reply );
    }
    if ( quote != null ) {
      quote.data = null;
      Draft.updateAspect( "quote", quote );
    }
  },
};




const Identity = {
  load: async () => {
    const draft = Draft.read();
    let current = draft.identities.map(( identity ) => identity.id );
  
    const engine = await FeedSaver.getEngine();
    const canon = engine.getIdentities();
    const target = canon.map(( identity ) => identity.id );

    if ( !Value.equal( current, target )) {
      const actives = {};
      for ( const { id, active } of draft.identities ) {
        actives[ id ] = active;
      }
      
      const identities = [];
      for ( const _identity of canon ) {
        const identity = Value.clone( _identity );
        identity.active = actives[ identity.id ] ?? false;
        identities.push( identity );
      }
      
      Draft.updateAspect( "identities", identities );
    }
  },

  find: ( target ) => {
    const draft = Draft.read();
    return draft.identities
      .find(( identity ) => identity.id == target );
  },

  clear: () => {
    return Identity.load({ identities: [] });
  }
};


const Lock = {
  find: () => {
    const draft = Draft.read();
    return draft.reply?.identity ?? draft.quote?.identity;
  },

  isRequired: () => Lock.find() != null,
  
  close: ( target ) => {
    const { identities } = Draft.read();
    target ??= Lock.find();
    for ( const identity of identities ) {
      identity.active = identity.id === target;
    }
    Draft.updateAspect( "identities", identities );
  }
};





const Name = {
  split: ( name ) => {
    const output = [];
    let current = [];
    
    for ( const c of name ) {
      if ( c === "@" ) {
        output.push( current.join("") + "@" );
        current = [];
      } else if ( c === "." ) {
        output.push( current.join("") + "." );
        current = [];
      } else {
        current.push( c );
      }
    }
  
    output.push( current.join("") );
    return output;
  }
};


const Media = {
  isFile: ( value ) => Type.isType( File, value ),
  isImage: ( value ) => /^image/.test( value.type ),
  isVideo: ( value ) => /^video/.test( value.type ),
};




class State {
  constructor() {
    this.closers = [];
  }

  static make () {
    return new State();
  }

  listen ( store, f ) {
    let closeFunction = Draft.subscribe( store, f );
    this.closers.push( closeFunction );
    return;
  }

  reset () {
    // Release Svelte store subscriptions using the close functions we collected.
    for ( const close of this.closers ) {
      close();
    }
    this.closers = [];
    
    // Run a cleanup if it was added to the instance.
    if ( this.cleanup != null ) {
      this.cleanup();
    }
  }
}



const Validate = {};
Validate.isValid = () => {
  const draft = Draft.read();
  console.log( "validating", draft );

  const tests = [
    Validate.active,
    Validate.bluesky,
    Validate.mastodon,
    Validate.reddit,
    Validate.smalltown,
  ];

  return tests.every( test => test() === true );
};


Validate.active = () => {
  const draft = Draft.read();
  const actives = draft.identities.filter( i => i.active === true );
  if ( actives.length === 0 ) {
    Draft.updateAspect( "alert", 
      "Must select an identity to publish this post.");
    return false;
  }
  return true;
};


Validate.hasContent = () => {
  const draft = Draft.read();
  return draft.content != null;
};

Validate.hasPlatform = ( target ) => {
  return () => {
    const draft = Draft.read();
    const hasPlatform = ({ platform }) => platform === target;
    const match = draft.identities.find( hasPlatform );
    return match != null;
  };
};

Validate.hasBluesky = Validate.hasPlatform( "bluesky" );
Validate.hasMastodon = Validate.hasPlatform( "mastodon" );
Validate.hasReddit = Validate.hasPlatform( "reddit" );
Validate.hasSmalltown = Validate.hasPlatform( "smalltown" );

Validate.bluesky = () => {
  if ( Validate.hasBluesky() && Bluesky.contentLength() > 300 ) {
    Draft.updateAspect( "alert",
      "Bluesky does not accept posts with more than 300 characters." );
    return false;
  }
  return true;
};

Validate.mastodon = () => {
  if ( Validate.hasMastodon() && Mastodon.contentLength() > 500 ) {
    Draft.updateAspect( "alert", 
      "Mastodon does not accept posts with more than 500 characters." );
    return false;
  }
  return true;
};

Validate.reddit = () => {
  if ( Validate.hasReddit() && Reddit.contentLength() > 40000 ) {
    Draft.updateAspect( "alert", 
      "Reddit does not accept posts with more than 40,000 characters." );
    return false;
  }
  return true;
};

Validate.smalltown = () => {
  if ( Validate.hasSmalltown() && Smalltown.contentLength() > 500 ) {
    Draft.updateAspect( "alert", 
      "Smalltown does not accept posts with more than 500 characters." );
    return false;
  }
  return true;
};



const Bluesky = {
  contentLength: () => {
    const draft = Draft.read();
    const links = linkify.find( draft.content, "url" );
    let length = draft.content.length;
    let surplus = 0;
    
    for ( const link of links ) {
      const url = new URL( link.href );
      if ( url.pathname.length > 16 ) {
        surplus += ( url.pathname.length - 16 );
      }
      if ( link.value.startsWith("https://") ) {
        surplus += 8;
      }
      else if ( link.value.startsWith("http://") ) {
        surplus += 7;
      }
    }
    
    return length - surplus;
  }
};


const Mastodon = {
  contentLength: () => {
    const draft = Draft.read();
    return draft.content?.length ?? 0;
  }
};


const Reddit = {
  contentLength: () => {
    const draft = Draft.read();
    return draft.content?.length ?? 0;
  }
};


const Smalltown = {
  contentLength: () => {
    const draft = Draft.read();
    return draft.content?.length ?? 0;
  }
};




export {
  Draft,
  Identity,
  Lock,

  Name,
  Media,

  State,

  Validate,
  Bluesky,
  Mastodon,
  Reddit,
  Smalltown
}