import { Cache } from "$lib/resources/cache.js";
import * as Type from "@dashkite/joy/type";

class FilteredPost {
  constructor ({ id }) {
    this.id = id;
  }

  static create() {
    // TODO: This should eventually hold the hidden post data.
    const id = Math.random().toString();
    return new FilteredPost({ id });
  }

  static isType ( value ) {
    return Type.isType( FilteredPost, value );
  }
}

const isFilteredPost = function ( value ) {
  return FilteredPost.isType( value );
}

const getLogo = function ( platform ) {
  return `/icons/${ platform }.svg`;
};

const getHeadingSlots = function ( source ) {
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

  if ( headingSlot1 == null ) {
    headingSlot1 = headingSlot2;
    headingSlot2 = null;
  }

  return { headingSlot1, headingSlot2 };
};

const getSourceCopy = function ( platform ) {
  let sourceCopy;
  switch ( platform ) {
    case "bluesky":
      sourceCopy = "View on Bluesky";
      break;
    case "mastodon":
      // Specialize this to name the server?
      sourceCopy = "View on Mastodon";
      break;
    case "reddit":
      sourceCopy = "View on Reddit";
      break;
    case "smalltown":
      // Specialize this to name the server?
      sourceCopy = "View on Smalltown";
      break;
    default:
      throw new Error( "unknown platform" );
  }

  return sourceCopy;
};

const getAvatarFallback = function ( source ) {
  switch ( source.platform ) {
    case "mastodon":
    case "smalltown":
      return "/icons/mastodon-avatar.png";
    case "bluesky":
      return "/icons/bluesky-avatar.png";
    case "reddit":
      return "/icons/reddit-avatar.png";
  }
};

const getAvatar = function ( source ) {
  return source.icon_url ?? getAvatarFallback( source );
};




const getShare = function ( shares ) {
  const share = shares[0];
  if ( share == null ) {
    return;
  }

  if ( share === "gobo-filtered-post" ) {
    return FilteredPost.create();
  }

  const post = Cache.getPost( share );
  if ( post == null ) {
    console.error(`expected post ${share}, but it appears to be missing from graph`);
  }
  return post;
};

const getReply = function ( reply ) {
  if ( reply == null ) {
    return;
  }

  if ( reply === "gobo-filtered-post" ) {
    return FilteredPost.create();
  }

  const post = Cache.getPost( reply );
  if ( post == null ) {
    console.error(`expected post ${reply}, but it appears to be missing from graph`);
  }
  return post;
};

const getThreads = function ( ids ) {
  const result = [];
  for( const id of ids ) {
    if ( id === "gobo-filtered-post" ) {
      result.push( FilteredPost.create() );
      continue;
    }

    const post = Cache.getPost( id );
    if ( post == null ) {
      console.error(`expected post ${id}, but it appears to be missing from graph`);
      continue;
    }
    result.push( post );
  }

  return result;
};


const getActionTarget = function ({ id, content, sharedPost }) {
  let actionTarget = null;
  if ( sharedPost != null && content == null ) {
    actionTarget = sharedPost.id;
  } else {
    actionTarget = id;
  }

  return actionTarget;
};



// Trace DOM parents until we get to overall post article.
const hasLinkParent = function ( element ) {
  if ( element.parentNode.tagName === "A" ) {
    return true;
  } else if ( element.parentNode.tagName === "ARTICLE" ) {
    return false;
  } else {
    return hasLinkParent( element.parentNode );
  }
}

const isLink = function ( element ) {
  if ( element.tagName === "A" ) {
    return true;
  } else if ( element.tagName === "ARTICLE" ) {
    return false;
  } else {
    return hasLinkParent( element )
  }
}

const hasButtonParent = function ( element ) {
  if ( element.parentNode.tagName === "SL-BUTTON" ) {
    return true;
  } else if ( element.parentNode.tagName === "ARTICLE" ) {
    return false;
  } else {
    return hasButtonParent( element.parentNode );
  }
};

const isButton = function ( element ) {
  if ( element.tagName === "SL-BUTTON" ) {
    return true;
  } else if ( element.tagName === "ARTICLE" ) {
    return false;
  } else {
    return hasButtonParent( element )
  }
};

const hasVideoParent = function ( element ) {
  if ( element.parentNode.tagName === "VIDEO" ) {
    return true;
  } else if ( element.parentNode.tagName === "ARTICLE" ) {
    return false;
  } else {
    return hasVideoParent( element.parentNode );
  }
};

const isVideo = function ( element ) {
  if ( element.tagName === "VIDEO" ) {
    return true;
  } else if ( element.tagName === "ARTICLE" ) {
    return false;
  } else {
    return hasVideoParent( element )
  }
};



const filterClickEvent = function ( fullPage, event ) {
  // Bail if this is a non-Enter key press event.
  if ( (event.type === "keydown") && (event.key !== "Enter") ) {
    return false;
  }

  // Bail if this is already the post's main page.
  if ( fullPage === true ) {
    return false;
  }

  // Bail if agent clicked a legit link.
  if ( isLink(event.target) ) {
    return false;
  }

  // Bail if agent clicked a button.
  if ( isButton(event.target) ) {
    return false;
  }

  // Bail if agent clicked a video.
  if ( isVideo(event.target) ) {
    return false;
  }

  // Bail if the agent is trying to highlight text for non-link purposes.
  if ( window.getSelection().toString().length > 0 ) {
    return false;
  }

  return true;
}


export {
  isFilteredPost,

  getHeadingSlots,
  getLogo,
  getSourceCopy,
  getAvatarFallback,
  getAvatar,

  getShare,
  getReply,
  getThreads,
  getActionTarget,


  filterClickEvent
}
