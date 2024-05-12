import * as Type from "@dashkite/joy/type";
import { Filter } from "$lib/engines/filter.js";
import { Weave } from "$lib/engines/weave.js";
import { Cache } from "$lib/resources/cache.js";
import * as Resource from "$lib/resources/post.js";
import * as Random from "$lib/helpers/random.js";
import { humanize } from "$lib/helpers/humanize.js";
import { render } from "$lib/helpers/markdown.js";

class FilteredPost {
  constructor ({ id }) {
    this.id = id;
  }

  static make() {
    // TODO: This should eventually hold the hidden post data.
    const id = Random.address();
    return new FilteredPost({ id });
  }

  static isType ( value ) {
    return Type.isType( FilteredPost, value );
  }
}



const Post = {};

Post.get = async ({ identity, id }, options = {}) => {
  try {
    const post = Cache.getPost( id );
    if ( post != null ) {
      return post;
    }
    
    const graph = await Resource.get({ identity, id });
    await Filter.primary( graph );
    const weave = Weave.make( graph );
    Weave.trimTraversals( weave );
    Cache.mergeWeave({ id: identity }, weave );
    return weave.posts[ weave.feed[0] ];

  } catch ( error ) {
    console.error( error );
    return;
  }
};

Post.source = ( post ) => {
  const source = Cache.getSource( post.source_id );
  if ( source == null ) {
    console.error(`engine post: unable to fetch source ${ post.source_id }`);
  }
  return source;
};

Post.copy = ( post ) => {
  let copy;
  switch ( post.platform ) {
    case "bluesky":
      copy = "View on Bluesky";
      break;
    case "mastodon":
      // Specialize this to name the server?
      copy = "View on Mastodon";
      break;
    case "reddit":
      copy = "View on Reddit";
      break;
    case "smalltown":
      // Specialize this to name the server?
      copy = "View on Smalltown";
      break;
    default:
      throw new Error( "unknown platform" );
  }

  return copy;
};

Post.isFiltered = ( value ) => FilteredPost.isType( value );

Post.href = ( post ) => post.proxyURL ?? post.url;

Post.logo = ( post ) => `/icons/${ post.platform }.svg`;

Post.content = ( post ) => render( post.content );

Post.published = ( post ) => humanize( post.published );

Post.embeds = ( post ) => {
  const ax = post.attachments ?? [];
  return {
    media: ax.filter( a => /^(image|video)\//.test( a.type )),
    text: ax.filter( a => /^application\/json/.test( a.type ))
  };
};

Post.share = ( post ) => {
  post.shares ??= [];
  const share = post.shares[0];
  if ( share == null ) {
    return;
  }

  if ( share === "gobo-filtered-post" ) {
    return FilteredPost.make();
  }

  return { id: share };
};

Post.thread = ( post ) => {
  post.threads ??= [];
  const result = [];
  for( const id of post.threads ) {
    if ( id === "gobo-filtered-post" ) {
      result.push( FilteredPost.make() );
      continue;
    }

    result.push({ id });
  }

  return result;
};

Post.actionTarget = ( post ) => {
  if ( post.shares[0] != null && post.content == null ) {
    return post.shares[0];
  } else {
    return post.id;
  }
};

Post.styles = ( post, options = {} ) => {
  const styles = {};
  if ( options.fullPage === true ) {
    styles.cursor = "inherit";
    styles.marginTop = "2rem";
  } else {
    styles.cursor = "pointer";
    styles.marginTop = "var(--gobo-height-spacer)"
  }
  
  styles.maxHeight = "15rem";
  styles.gradientStop = "10rem";
  if ( options.fullPage === true ) {
    styles.gradient = "none"
  } else {
    styles.gradient = "linear-gradient( 180deg, #000 var(--gradient-stop), transparent )"
  }

  const overrides = options.styleOverrides ?? {};
  for ( const key in overrides ) {
    const style = overrides[ key ];
    styles[ key ] = style;
  }

  return styles;
};






const Source = {};

Source.get = ( id ) => {
  const source = Cache.getSource( id );
}

Source.href = ( source ) => source.proxyURL ?? source.url;

Source.avatar = ( source ) => source.icon_url || Source.fallback( source );

Source.fallback = ( source ) => {
  switch ( source.platform ) {
    case "mastodon":
    case "smalltown":
      return "/icons/mastodon-avatar.png";
    case "bluesky":
      return "/icons/bluesky-avatar.png";
    case "reddit":
      return "/icons/reddit-subreddit-avatar.png";
    default:
      return "/icons/mastodon-avatar.png";
  }
};

Source.headings = ( source ) => {
  let headingSlot1, headingSlot2;
  switch ( source.platform ) {
    case "bluesky":
      headingSlot1 = source.name;
      headingSlot2 = `@${source.username}`;
      break;
    case "mastodon":
      headingSlot1 = source.name;
      headingSlot2 = `@${source.username}`;
      break;
    case "reddit":
      headingSlot1 = `r/${source.name}`;
      break;
    case "smalltown":
      headingSlot1 = source.name;
      headingSlot2 = `@${source.username}`;
      break;
  }

  if ( !headingSlot1 ) {
    headingSlot1 = headingSlot2;
    headingSlot2 = null;
  }

  return { headingSlot1, headingSlot2 };
};

Source.copy = Post.copy;




const Click = {};

// Trace DOM parents until we get to overall post article.
Click.hasLinkParent = ( element ) => {
  if ( element.parentNode.tagName === "A" ) {
    return true;
  } else if ( element.parentNode.tagName === "ARTICLE" ) {
    return false;
  } else {
    return Click.hasLinkParent( element.parentNode );
  }
};

Click.isLink = ( element ) => {
  if ( element.tagName === "A" ) {
    return true;
  } else if ( element.tagName === "ARTICLE" ) {
    return false;
  } else {
    return Click.hasLinkParent( element )
  }
};

Click.hasButtonParent = ( element ) => {
  if ( element.parentNode.tagName === "SL-BUTTON" ) {
    return true;
  } else if ( element.parentNode.tagName === "ARTICLE" ) {
    return false;
  } else {
    return Click.hasButtonParent( element.parentNode );
  }
};

Click.isButton = ( element ) => {
  if ( element.tagName === "SL-BUTTON" ) {
    return true;
  } else if ( element.tagName === "ARTICLE" ) {
    return false;
  } else {
    return Click.hasButtonParent( element )
  }
};

Click.hasVideoParent = ( element ) => {
  if ( element.parentNode.tagName === "VIDEO" ) {
    return true;
  } else if ( element.parentNode.tagName === "ARTICLE" ) {
    return false;
  } else {
    return Click.hasVideoParent( element.parentNode );
  }
};

Click.isVideo = ( element ) => {
  if ( element.tagName === "VIDEO" ) {
    return true;
  } else if ( element.tagName === "ARTICLE" ) {
    return false;
  } else {
    return Click.hasVideoParent( element )
  }
};

Click.passes = ( fullPage, event ) => {
  // Bail if this is a non-Enter key press event.
  if ( (event.type === "keydown") && (event.key !== "Enter") ) {
    return false;
  }

  // Bail if this is already the post's main page.
  if ( fullPage === true ) {
    return false;
  }

  // Bail if agent clicked a legit link.
  if ( Click.isLink(event.target) ) {
    return false;
  }

  // Bail if agent clicked a button.
  if ( Click.isButton(event.target) ) {
    return false;
  }

  // Bail if agent clicked a video.
  if ( Click.isVideo(event.target) ) {
    return false;
  }

  // Bail if the agent is trying to highlight text for non-link purposes.
  if ( window.getSelection().toString().length > 0 ) {
    return false;
  }

  return true;
};





export {
  FilteredPost,

  Post,
  Source,
  Click
}
