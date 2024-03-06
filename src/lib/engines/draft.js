import * as Value from "@dashkite/joy/value";
import * as Type from "@dashkite/joy/type";
import * as linkify from "linkifyjs";
import * as LS from "$lib/helpers/local-storage.js";
import * as Post from "$lib/resources/post.js";
import * as FeedSaver from "$lib/engines/feed-singleton.js";
import { draftStores } from "$lib/stores/draft.js";

let singletonDraft;

const Draft = {};
Draft.make = () => {
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
};

Draft.read = () => {
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
};

Draft.write = () => LS.write( "gobo-draft", singletonDraft );


// Handle broadcast and listening coordination among components.
Draft.subscribe = ( store, f ) => draftStores[ store ].subscribe( f );
Draft.put = ( store, value ) =>  draftStores[ store ].put( value );
  
// Which brings us to a widefield broadcast function to make sure everyone
// has the latest data. Useful at the page level and for broad changes.
Draft.load = () => {
  const draft = Draft.read();
  Draft.put( "content", draft );
  Draft.put( "identities", draft );
  Draft.put( "attachments", draft );
  Draft.put( "reply", draft );
  Draft.put( "quote", draft );
  Draft.put( "options", draft );
  Draft.put( "alert", draft );
  return draft;
};


Draft.clear = async () => {
    singletonDraft = Draft.make();
    singletonDraft.identities = await Identity.sync();
    Draft.write();
    Draft.load();
};
Draft.update = ( data ) => {
  const draft = Draft.read();
  Object.assign( draft, data );
  Draft.write();
  Draft.load();
};
Draft.updateAspect = ( aspect, value ) => {
  const draft = Draft.read();
  Object.assign( draft, { [aspect]: value });
  Draft.write();
  Draft.put( aspect, draft );
};


Draft.loadReply = async () => {
  let { reply } = Draft.read();
  if ( reply == null ) {
    return;
  }
  reply.data = await Post.get( reply );
  Draft.updateAspect( "reply", reply );
};

Draft.loadQuote = async () => {
  let { quote } = Draft.read();
  if ( quote == null ) {
    return;
  }
  quote.data = await Post.get( quote );
  Draft.updateAspect( "quote", quote );
};

Draft.publish = Post.publish;

// This is unfortunately hacky. For replies and quotes, the post data is
// stowed in the draft store, including local storage. However, on page
// reloads, the memory cache of the any resource in the graph connected to
// that post is lost. This speaks to a need for a component-centered
// realignment that can use fine-grained HTTP caching. But there's some
// awkwardness from Svelte and time constraints. The more simple solution
// for now is to prune the cached graph data from the draft, forcing the
// component to wait for the application cache to be authoritative.
Draft.pruneGraph = () => {
  const { reply, quote } = Draft.read();
  if ( reply != null ) {
    reply.data = null;
    Draft.updateAspect( "reply", reply );
  }
  if ( quote != null ) {
    quote.data = null;
    Draft.updateAspect( "quote", quote );
  }
};




const Identity = {};
Identity.sync = async () => {
  const draft = Draft.read();
  let current = draft.identities.map( identity => identity.id );
  
  const engine = await FeedSaver.getEngine();
  const canon = engine.getIdentities();
  const target = canon.map(( identity ) => identity.id );

  if ( Value.equal( current, target )) {
    return draft.identities;
  }
  
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
  return identities;
};

Identity.load = async () => {
  const identities = await Identity.sync();
  Draft.updateAspect( "identities", identities );
};

Identity.find = ( target ) => {
  const draft = Draft.read();
  return draft.identities
    .find(( identity ) => identity.id == target );
};

Identity.findActive = ( target ) => {
  const draft = Draft.read();
  return draft.identities.find(({ platform, active }) => {
    return (platform === target) && (active === true);
  });
}

Identity.hasActive = ( target ) => {
  return () => {
    const match = Identity.findActive( target );
    return match != null;
  };
};

Identity.hasBluesky = Identity.hasActive( "bluesky" );
Identity.hasMastodon = Identity.hasActive( "mastodon" );
Identity.hasReddit = Identity.hasActive( "reddit" );
Identity.hasSmalltown = Identity.hasActive( "smalltown" );

Identity.clear = () => {
  return Identity.load({ identities: [] });
};


const Lock = {
  find: () => {
    const draft = Draft.read();
    return draft.reply?.identity ?? draft.quote?.identity;
  },

  isRequired: () => Lock.find() != null,

  getIdentity: () => {
    const { identities } = Draft.read();
    const id = Lock.find();
    return identities.find( i => i.id === id );
  },
  
  close: ( target ) => {
    const { identities } = Draft.read();
    target ??= Lock.find();
    for ( const identity of identities ) {
      identity.active = identity.id === target;
    }
    Draft.updateAspect( "identities", identities );
  }
};



const Options = {};
Options.handle = ( name, event ) => {
  if ( event?.target?.checked != null ) {
    Options.checked( name, event );
  } else {
    Options.value( name, event );
  }
};

Options.checked = ( name, event ) => {
  const value = event.target.checked;
  Options.update( name, value );
}

Options.value = ( name, event ) => {
  const value = Options.nullEmpty( event.target.value );
  Options.update( name, value );
}

Options.nullEmpty = ( value ) => {
  if ( value == null ) {
    return null
  } else {
    if ( value.length === 0 ) {
      return null;
    } else {
      return value;
    }
  }
};

Options.update = ( name, value ) => {
  const { options } = Draft.read();
  options[ name ] = value;
  Draft.updateAspect( "options", options );
};





const Name = {
  split: ( name ) => {
    const output = [];
    let current = [];
    
    for ( const c of name ) {
      if ( c === "@" ) {
        output.push( current.join( "" ));
        current = [ "@" ];
      } else if ( c === "." ) {
        output.push( current.join( "" ));
        current = [ "." ];
      } else {
        current.push( c );
      }
    }
  
    output.push( current.join( "" ));
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
    this.cleanup = function () {};
  }

  static make () {
    return new State();
  }

  listen ( store, f ) {
    const g = ( draft ) => {
      if ( draft == null ) {
        return;
      } else {
        return f( draft );
      }
    };

    let closeFunction = Draft.subscribe( store, g );
    this.closers.push( closeFunction );
    return;
  }

  // Handles sundry tasks when destroying a component.
  reset () {
    // Release Svelte store subscriptions using the collected closers.
    for ( const close of this.closers ) {
      close();
    }
    this.closers = [];    
    this.cleanup();
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

Validate.bluesky = () => {
  if ( !Identity.hasBluesky() ) {
    return true;
  }

  if ( Bluesky.contentLength() > Bluesky.characterLimit ) {
    const number = new Intl.NumberFormat().format( Bluesky.characterLimit );
    Draft.updateAspect( "alert",
      `Bluesky does not accept posts with more than ${ number } characters.` );
    return false;
  }
  return true;
};

Validate.mastodon = () => {
  if ( !Identity.hasMastodon() ) {
    return true;
  }

  if ( Mastodon.contentLength() > Mastodon.characterLimit ) {
    const number = new Intl.NumberFormat().format( Mastodon.characterLimit );
    Draft.updateAspect( "alert",
      `Mastodon does not accept posts with more than ${ number } characters.` );
    return false;
  }
  return true;
};

Validate.reddit = () => {
  if ( !Identity.hasReddit() ) {
    return true;
  }

  if ( Reddit.contentLength() > Reddit.characterLimit ) {
    const number = new Intl.NumberFormat().format( Reddit.characterLimit );
    Draft.updateAspect( "alert",
      `Reddit does not accept posts with more than ${ number } characters.` );
    return false;
  }
  return true;
};

Validate.smalltown = () => {
  if ( !Identity.hasSmalltown() ) {
    return true;
  }

  if ( Smalltown.contentLength() > Smalltown.characterLimit ) {
    const number = new Intl.NumberFormat().format( Smalltown.characterLimit );
    Draft.updateAspect( "alert",
      `Smalltown does not accept posts with more than ${ number } characters.` );
    return false;
  }
  return true;
};



const Bluesky = {};
Bluesky.characterLimit = 300;
Bluesky.contentLength = () => {
  const draft = Draft.read();
  if ( draft.content == null ) {
    return 0;
  }

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
};


// From: https://docs.joinmastodon.org/user/posting/
// "All links are counted as 23 characters, no matter how long they actually are"
const Mastodon = {};
Mastodon.characterLimit = 500;
Mastodon.contentLength = () => {
  const draft = Draft.read();
  if ( draft.content == null ) {
    return 0;
  }

  const links = linkify.find( draft.content, "url" );
  let length = draft.content.length;
  let surplus = 0;
  
  for ( const link of links ) {
    surplus -= 23 - link.href.length;
  }
  
  return length - surplus;
};


const Reddit = {};
Reddit.characterLimit = 40000;
Reddit.contentLength = () => {
  const draft = Draft.read();
  return draft.content?.length ?? 0;
};


const Smalltown = {};
Smalltown.characterLimit = 500;
Smalltown.contentLength = () => {
  const draft = Draft.read();
  return draft.content?.length ?? 0;
};




export {
  Draft,
  Identity,
  Lock,

  Options,

  Name,
  Media,

  State,

  Validate,
  Bluesky,
  Mastodon,
  Reddit,
  Smalltown
}