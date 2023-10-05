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
      sourceCopy = "View on Mastodon";
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
    case "bluesky":
      return "https://mastodon.social/avatars/original/missing.png";
    case "reddit":
      return "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_6.png";
  }
};

const getAvatar = function ( source ) {
  return source.icon_url ?? getAvatarFallback( source );
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
  getHeadingSlots,
  getLogo,
  getSourceCopy,
  getAvatarFallback,
  getAvatar,


  filterClickEvent
}
