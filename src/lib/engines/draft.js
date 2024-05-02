import * as Value from "@dashkite/joy/value";
import * as Type from "@dashkite/joy/type";
import * as linkify from "linkifyjs";
import { RichText, BskyAgent, UnicodeString } from "@atproto/api";
import { Identity as IdentityEngine, Name } from "$lib/engines/identity.js";
import * as Post from "$lib/resources/post.js";
import * as Image from "$lib/resources/draft-image.js";
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
    linkPreview: {},
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
  Draft.put( "linkPreview", draft );
  Draft.put( "identities", draft );
  Draft.put( "attachments", draft );
  Draft.put( "reply", draft );
  Draft.put( "quote", draft );
  Draft.put( "options", draft );
  Draft.put( "alerts", draft );
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
    Validate.linkedin,
    Validate.mastodon,
    Validate.reddit,
    Validate.smalltown,
  ];

  const results = [];
  for ( const test of tests ) {
    results.push( test( draft ));
  }
  return results.every( result => result === true );
};


Validate.active = () => {
  const draft = Draft.read();
  
  const actives = draft.identities.filter( i => i.active === true );
  if ( actives.length === 0 ) {
    Draft.pushAlert( "You must select an identity to publish this post." );
    return false;
  }
  
  const stales = actives.filter( i => i.stale === true );
  if ( stales.length > 0 ) {
    Draft.pushAlert( "One of the selected identities has a lapsed integration and cannot be used publish." );
    return false;
  }

  const reddits = actives.filter( i => i.platform === "reddit" );
  if ( reddits.length > 1 ) {
    Draft.pushAlert( "You may only publish with on Reddit identity at a time." );
    return false;    
  }
  
  return true;
};


Validate.hasContent = () => {
  const draft = Draft.read();
  return draft.content != null;
};

Validate.bluesky = ( draft ) => {
  if ( !Identity.hasBluesky() ) {
    return true;
  }

  if ( Bluesky.contentLength() > Bluesky.characterLimit ) {
    const number = new Intl.NumberFormat().format( Bluesky.characterLimit );
    Draft.pushAlert(
      `Bluesky does not accept posts with more than ${ number } characters.`
    );
    return false;
  }

  if ( (draft.content == null) || (draft.content === "") ) {
    Draft.pushAlert(
      `Bluesky does not allow empty post content.`
    );
    return false;
  }

  if ( draft.attachments.length > 4 ) {
    Draft.pushAlert(
      `Bluesky does not allow more than 4 attachments per post.`
    );
    return false;
  }

  return true;
};

Validate.linkedin = ( draft ) => {
  if ( !Identity.hasLinkedin() ) {
    return true;
  }

  if ( Linkedin.contentLength() > Linkedin.characterLimit ) {
    const number = new Intl.NumberFormat().format( Linkedin.characterLimit );
    Draft.pushAlert(
      `LinkedIn does not accept posts with more than ${ number } characters.`
    );
    return false;
  }

  if ( (draft.content == null) || (draft.content === "") ) {
    Draft.pushAlert(
      `LinkedIn does not allow empty post content.`
    );
    return false;
  }

  if ( draft.attachments.length > 4 ) {
    Draft.pushAlert(
      `LinkedIn does not allow more than 4 attachments per post.`
    );
    return false;
  }

  return true;
};

Validate.mastodon = ( draft ) => {
  if ( !Identity.hasMastodon() ) {
    return true;
  }

  if ( Mastodon.contentLength() > Mastodon.characterLimit ) {
    const number = new Intl.NumberFormat().format( Mastodon.characterLimit );
    Draft.pushAlert(
      `Mastodon does not accept posts with more than ${ number } characters.`
    );
    return false;
  }

  if ( (draft.content == null) || (draft.content === "") ) {
    Draft.pushAlert(
      `Mastodon does not allow empty post content.`
    );
    return false;
  }

  if ( draft.attachments.length > 4 ) {
    Draft.pushAlert(
      `Bluesky does not allow more than 4 attachments per post.`
    );
    return false;
  }

  return true;
};

Validate.reddit = ( draft ) => {
  if ( !Identity.hasReddit() ) {
    return true;
  }

  if ( Reddit.contentLength() > Reddit.characterLimit ) {
    const number = new Intl.NumberFormat().format( Reddit.characterLimit );
    Draft.pushAlert(
      `Reddit does not accept posts with more than ${ number } characters.`
    );
    return false;
  }

  if ( (draft.content == null) || (draft.content === "") ) {
    Draft.pushAlert(
      `Reddit does not allow empty post content.`
    );
    return false;
  }

  const options = draft.options.reddit;
  if ( !options.subreddit ) {
    Draft.pushAlert(
      `Please specify the subreddit for this Reddit post.`
    );
    return false;
  }

  if ( !draft.options.general.title ) {
    Draft.pushAlert(
      `Please provide a title for this Reddit post.`
    );
    return false;
  }

  if ( draft.attachments.length > 20 ) {
    Draft.pushAlert(
      `Bluesky does not allow more than 20 attachments per post.`
    );
    return false;
  }

  return true;
};

Validate.smalltown = ( draft ) => {
  if ( !Identity.hasSmalltown() ) {
    return true;
  }

  if ( Smalltown.contentLength() > Smalltown.characterLimit ) {
    const number = new Intl.NumberFormat().format( Smalltown.characterLimit );
    Draft.pushAlert(
      `Smalltown does not accept posts with more than ${ number } characters.`
    );
    return false;
  }

  if ( (draft.content == null) || (draft.content === "") ) {
    Draft.pushAlert(
      `Smalltown does not allow empty post content.`
    );
    return false;
  }

  return true;
};



const Bluesky = {};
Bluesky.characterLimit = 300;
Bluesky.agent = new BskyAgent({ service: "https://bsky.app" });

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


// Bluesky truncates URLs into a "domain plus 16" format that will ellide
// URLs that go over the limit while leaving short URLs unchanged.
Bluesky.shortURL = ( _url ) => {
  const url = new URL( _url );
  const target = url.pathname + url.search + url.hash;
  if ( target.length > 15 ) {
    return url.host + target.slice( 0, 13 ) + "...";
  }
  return url.host + target;
};

// This is focused only on how URLs appear in the preview. Currently, it matches
// the shortURL facet calculation, but that might diverge somehow, as it does
// in Mastodon. This provides interface uniformity. Maybe move this elsewhere.
Bluesky.urlGlamor = Bluesky.shortURL;


Bluesky.findLink = ( facet ) => {
  const type = "app.bsky.richtext.facet#link";
  return facet.features.find( f => f.$type === type );
};

Bluesky.isLink = ( facet ) => {
  return Bluesky.findLink( facet ) != null;
}

Bluesky.shortenLink = ( rt, facet ) => {
  const { byteStart, byteEnd } = facet.index;
  const url = rt.unicodeText.slice( byteStart, byteEnd );
  const shortened = new UnicodeString( Bluesky.shortURL( url ));
  
  // insert the shortened URL
  rt.insert( byteStart, shortened.utf16 );
  
  // update the facet to cover the new shortened URL
  facet.index.byteStart = byteStart;
  facet.index.byteEnd = byteStart + shortened.length;

  // remove the old URL, now placed after the inserted short URL.
  rt.delete( byteStart + shortened.length, byteEnd + shortened.length );
}

// TODO: Do we need to perform this extraction?
// 1. We can hand-code what validation stuff we need, then use the Bluesky 
//    affordance of accepting a plain string to avoid all this.
//    Right now, the atproto library makes network requests to Bluesky to come
//    up with facets, but we still have to do tedious string calculations. So
//    we take on heft and asynchronicity, but we get little value in exchange.
//    We're allowed to submit simple strings to Bluesky. We could return to that
//    if we can handle our own validation needs sufficiently.
// 
// 2. Or we can bring the validation Bluesky block into alignment with this and
//    try to involve the atproto library for a higher fidelity check.
Bluesky.extractFacets = async ( content ) => {
  if ( content == null || content == "" ) {
    return { text: "", facets: [] };
  }

  const rt = new RichText({ text: content });
  await rt.detectFacets( Bluesky.agent );
  let facets = rt.facets ?? [];
  
  // Go through each facet and update the rich text instance.
  for ( const facet of facets ) {
    if ( Bluesky.isLink( facet )) {
      Bluesky.shortenLink( rt, facet );
    }
  }

  // Return the resulting text computation.
  return { facets, text: rt.text };
};

Bluesky.fetchCardImage = async ( url ) => {
  const response = await fetch( url );
  const mime = response.headers.get( "content-type" ) ?? "image/jpeg";
  const blob = await response.blob();
  return { mime, blob };
};

Bluesky.uploadCardImage = async ( file ) => {
  const draftImage = await Image.create({
    file,
    name: "link-card-image",
    alt: ""
  });
  return draftImage.id;
};

Bluesky.buildCard = async ( context ) => {
  if ( context.url == null ) {
    return;
  }

  const linkCard = {
    url: context.url,
    title: context.title,
    description: context.description
  };

  if ( context.image != null && context.image.length > 0 ) {
    const image = await Bluesky.fetchCardImage( context.image );
    const id = await Bluesky.uploadCardImage( image.blob );
    linkCard.image = { id, mime: image.mime };
  }

  return linkCard;
};

Bluesky.build = async ( draft ) => {
  let reply;
  if ( draft.reply?.data != null ) {
    const id = draft.reply.data.feed[0];
    reply = draft.reply.data.posts.find( p => p.id == id );
  }

  let quote;
  if ( draft.quote?.data != null ) {
    const id = draft.quote.data.feed[0];
    quote = draft.quote.data.posts.find( p => p.id == id );
  }

  const { facets, text } = await Bluesky.extractFacets( draft.content );
  const linkCard = await Bluesky.buildCard( draft.linkPreview );
  
  return {
    reply,
    quote,
    facets,
    linkCard,
    text
  };
};



const Linkedin = {};
Linkedin.characterLimit = 3000;

// These won't be real shortened links, but they approximate the appearance
// by always coming in at 26 characters.
Linkedin.urlGlamor = ( _url ) => {
  if ( _url.length > 26 ) {
    return "https://lnkd.in/e3rvsvVTsd";
  } else {
    return _url;
  }
};

// From https://www.linkedin.com/help/linkedin/answer/a521889/short-urls-in-shared-posts
// "When you share a link that's longer than 26 characters, we automatically 
// shorten it once you click Post, to make it easier to read."
Linkedin.contentLength = () => {
  const draft = Draft.read();
  if ( draft.content == null ) {
    return 0;
  }

  const links = linkify.find( draft.content, "url" );
  let removed = 0;
  
  for ( const link of links ) {
    if ( link.href.length > 26 ) {
      removed += link.href.length - 26;
    }
  }
  
  return draft.content.length - removed;
};

// TODO: There is a looming problem here on the visiblity question.
// Unlike the other current platforms, LinkedIn uses a double-opt-in social
// edge model. So the generic word would be something like "mutals".
// That affects graph calculations in theory, but we can't acutally do that
// much with LinkedIn's graph at the moment.
Linkedin.buildVisibility = ( draft ) => {
  switch ( draft.options.linkedin.visibility ) {
    case null:
    case "public":
      return "PUBLIC";
    case "mutuals":
      return "CONNECTIONS";
  }
};

// TODO: This is a copy of the builder function for the Bluesky module. When
// we generalize link preview generation, revisit this function.
Linkedin.buildCard = async ( context ) => {
  if ( context.url == null ) {
    return;
  }

  const linkCard = {
    url: context.url,
    title: context.title,
    description: context.description
  };

  if ( context.image != null && context.image.length > 0 ) {
    const image = await Bluesky.fetchCardImage( context.image );
    const id = await Bluesky.uploadCardImage( image.blob );
    linkCard.image = { id, mime: image.mime };
  }

  return linkCard;
};

Linkedin.build = async ( draft ) => {
  const linkCard = await Linkedin.buildCard( draft.linkPreview );

  return {
    visibility: Linkedin.buildVisibility( draft ),
    linkCard,
  };
};



const Mastodon = {};
Mastodon.characterLimit = 500;

// This is unrelated to the character length calcluation below.
// This aims to emperically mimic the visual representation of URLs in the
// Mastodon client. They show more characters and remove the scheme.
Mastodon.urlGlamor = ( _url ) => {
  const url = new URL( _url );
  let string = url.host + url.pathname;
  if ( string.length > 30 ) {
    string = string.slice( 0, 30 ) + "…";
  }  
  return string;
};

// From: https://docs.joinmastodon.org/user/posting/
// "All links are counted as 23 characters, no matter how long they actually are"
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

Mastodon.buildVisibility = ( draft ) => {
  switch ( draft.options.mastodon.visibility ) {
    case null:
    case "public":
      return "public";
    case "unlisted":
      return "unlisted";
    case "private":
    case "followers only":
      return "private";
    case "direct":
      return "direct"
  }
};

Mastodon.build = ( draft ) => {
  let reply;
  if ( draft.reply?.data != null ) {
    const id = draft.reply.data.feed[0];
    reply = draft.reply.data.posts.find( p => p.id == id );
  }

  return {
    visibility: Mastodon.buildVisibility( draft ),
    spoiler: draft.options.mastodon.spoilerText,
    sensitive: draft.options.attachments.sensitive,
    reply
  };
};


const Reddit = {};
Reddit.characterLimit = 40000;
Reddit.contentLength = () => {
  const draft = Draft.read();
  return draft.content?.length ?? 0;
};

Reddit.build = ( draft ) => {
  let reply;
  if ( draft.reply?.data != null ) {
    const id = draft.reply.data.feed[0];
    reply = draft.reply.data.posts.find( p => p.id == id );
  }

  return {
    subreddit: draft.options.reddit.subreddit,
    spoiler: draft.options.reddit.spoiler,
    nsfw: draft.options.attachments.sensitive,
    reply
  };
};


const Smalltown = {};
Smalltown.characterLimit = 500;

// For now, these are based on the Mastodon helpers.
Smalltown.urlGlamor = Mastodon.urlGlamor;
Smalltown.contentLength = Mastodon.contentLength;

Smalltown.build = ( draft ) => {
  let reply;
  if ( draft.reply?.data != null ) {
    const id = draft.reply.data.feed[0];
    reply = draft.reply.data.posts.find( p => p.id == id );
  }

  return {
    sensitive: draft.options.attachments.sensitive,
    spoiler: draft.options.smalltown.spoilerText,
    reply
  };
};



const Metadata = {};
Metadata.build = async ( identity, draft ) => {
  switch ( identity.platform ) {
    case "bluesky":
      return await Bluesky.build( draft );
    case "linkedin":
      return await Linkedin.build( draft );
    case "mastodon":
      return Mastodon.build( draft );
    case "reddit":
      return Reddit.build( draft );
    case "smalltown":
      return Smalltown.build( draft );
    default:
      throw new Error("unknown platform type");
  }
};




const Publish = {};

Publish.build = ( draft ) => {
  const post = {};
  post.content = draft.content;
  post.title = draft.options?.general?.title ?? undefined;
  // post.poll = {};
  return post;
};


Publish.uploadAttachments = async ( draft ) => {
  const ids = [];
  for ( const attachment of draft.attachments ) {
    const image = await Image.create( attachment );
    ids.push( image.id );
  }
  return ids;
};


Publish.buildTargets = async ( draft ) => {
  const targets = [];
  for ( const identity of draft.identities ) {
    if ( identity.active === true ) {
      try {
        const metadata = await Metadata.build( identity, draft );
        targets.push({ identity: identity.id, metadata });
      } catch ( error ) {
        console.error( error );
        Draft.pushAlert( `Unable to prepare post for platform ${ identity?.platform }.` );
        targets.push( false );
      }
    }
  }
  return targets;
};


Publish.flow = async function ( draft ) {
  let post, targets;
  
  try {
    post = Publish.build( draft );
  } catch ( error ) {
    console.error( error );
    Draft.pushAlert( "Unable to build post base." );
    return { success: false };
  }

  try {
    post.attachments = await Publish.uploadAttachments( draft );
  } catch ( error ) {
    console.error( error );
    Draft.pushAlert( "Failed to upload images." );
    return { success: false };
  }
  
  targets = await Publish.buildTargets( draft );
  if ( targets.includes( false )) {
    return { success: false };
  }
 
  try {
    await Post.publish( post, targets );
    return { success: true };
  } catch ( error ) {
    console.error( error );
    Draft.pushAlert( "Failed to submit post to Gobo API." );
    return { success: false };
  }
};

Draft.publish = Publish.flow;




export {
  Draft,
  Identity,
  Name,
  Lock,

  Options,
  Media,
  State,

  Validate,
  Bluesky,
  Linkedin,
  Mastodon,
  Reddit,
  Smalltown,

  Metadata,
  Publish
}