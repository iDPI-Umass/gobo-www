import * as Value from "@dashkite/joy/value";
import * as Type from "@dashkite/joy/type";
import * as LS from "$lib/helpers/local-storage.js";
import { getPost } from "$lib/resources/post.js";
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
    reply.data = await getPost( reply );
    Draft.updateAspect( "reply", reply );
  },

  loadQuote: async () => {
    let { quote } = Draft.read();
    if ( quote == null ) {
      return;
    }
    quote.data = await getPost( quote );
    Draft.updateAspect( "quote", quote );
  },

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




export {
  Draft,
  Identity,
  Lock,

  Name,
  Media,

  State
}