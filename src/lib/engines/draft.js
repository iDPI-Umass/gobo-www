import * as Value from "@dashkite/joy/value";
import * as Type from "@dashkite/joy/type";
import { Identity as IdentityEngine, Name } from "$lib/engines/identity.js";
import { DraftFile } from "$lib/engines/draft-file.js"
import * as Post from "$lib/resources/post.js";
import * as draftStores from "$lib/stores/draft.js";
import * as LS from "$lib/helpers/local-storage.js";
import * as Random from "$lib/helpers/random.js";


let singletonDraft;

const Draft = {};
Draft.make = () => {
  return {
    alerts: [],
    identities: [],
    attachments: [],
    options: {
      general: {
        title: null,
      },
      linkedin: {
        visibility: "public"
      },
      mastodon: {
        visibility: "public",
        spoilerText: null,
      },
      reddit: {
        subreddit: null,
        spoiler: false,
      },
      smalltown: {
        spoilerText: null,
      },
      attachments: {
        sensitive: false,
      },
    },
    content: null,
    thread: [],
    linkPreview: {},
    reply: null,
    quote: null
  };
};

Draft.read = () => {
  if ( singletonDraft == null ) {
    let draft = LS.read( "gobo-draft" );
    
    if ( draft == null ) {
      singletonDraft = Draft.make();
    
    } else {  
      const files = [];
      for ( const _ of draft.attachments ) {
        if ( _?.id != null ) {
          files.push( DraftFile.make(_) );
        }
      }
      draft.attachments = files;
      singletonDraft = draft;
    }
  }
  
  return singletonDraft;
};

Draft.write = () => {
  const { attachments, ...rest } = singletonDraft;
  const draft = Value.clone( rest );
  const files = [];
  for ( const draftFile of attachments ) {
    files.push( draftFile._ );
  }
  draft.attachments = files;
  LS.write( "gobo-draft", draft );
}


// Handle broadcast and listening coordination among components.
Draft.subscribe = ( store, f ) => draftStores[ store ].subscribe( f );
Draft.put = ( store, value ) =>  draftStores[ store ].put( value );
  
// Which brings us to a widefield broadcast function to make sure everyone
// has the latest data. Useful at the page level and for broad changes.
Draft.load = () => {
  const draft = Draft.read();
  Draft.put( "identities", draft );
  Draft.put( "content", draft );
  Draft.put( "thread", draft );
  Draft.put( "linkPreview", draft );
  Draft.put( "attachments", draft );
  Draft.put( "reply", draft );
  Draft.put( "quote", draft );
  Draft.put( "options", draft );
  Draft.put( "alerts", draft );
  return draft;
};


Draft.clear = async () => {
    const draft = Draft.read();
    for ( const attachment of draft.attachments ) {
      attachment.revoke();
    }
    singletonDraft = Draft.make();
    singletonDraft.identities = await Identity.sync();
    Draft.write();
    Draft.load();
};
Draft.update = ( data ) => {
  const draft = Draft.read();
  Object.assign( draft, data );
  Draft.write();
  return Draft.load();
};
Draft.updateAspect = ( aspect, value ) => {
  const draft = Draft.read();
  Object.assign( draft, { [aspect]: value });
  Draft.write();
  Draft.put( aspect, draft );
  return draft;
};
Draft.pushAlert = ( message ) => {
  const draft = Draft.read();
  draft.alerts.push({
    key: Random.address(),
    message
  });
  Draft.put( "alerts", draft );
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
  
  const canon = await IdentityEngine.read();
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

Identity.list = () => {
  const draft = Draft.read();
  return draft.identities;
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
};

Identity.hasActive = ( target ) => {
  return () => {
    const match = Identity.findActive( target );
    return match != null;
  };
};

Identity.hasBluesky = Identity.hasActive( "bluesky" );
Identity.hasLinkedin = Identity.hasActive( "linkedin" );
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
Options.handle = ( group, name, event ) => {
  if ( event?.target?.checked != null ) {
    Options.checked( group, name, event );
  } else {
    Options.value( group, name, event );
  }
};

Options.checked = ( group, name, event ) => {
  const value = event.target.checked;
  Options.update( group, name, value );
}

Options.value = ( group, name, event ) => {
  const value = Options.nullEmpty( event.target.value );
  Options.update( group, name, value );
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

Options.update = ( group, name, value ) => {
  const { options } = Draft.read();
  options[ group ][ name ] = value;
  Draft.updateAspect( "options", options );
};





const Media = {};

Media.isFile = ( value ) => Type.isType( File, value );

Media.isImage = ( value ) => /^image/.test( value.type );
Media.isAudio = ( value ) => /^audio/.test( value.type );
Media.isVideo = ( value ) => /^video/.test( value.type );
Media.isDocument = ( value ) => /^application/.test( value.type );

Media.canPreview = ( value ) => {
  if ( Media.isImage( value )) {
    return true;
  }
  if ( Media.isAudio( value )) {
    return true;
  }
  if ( Media.isVideo( value )) {
    return true;
  }
  return false;
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



export {
  Draft,
  Identity,
  Name,
  Lock,

  Options,
  Media,
  State,
}