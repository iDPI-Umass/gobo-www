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
    case "bluesky":
      return "https://mastodon.social/avatars/original/missing.png";
    case "reddit":
      return "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_6.png";
  }
};

const getAvatar = function ( source ) {
  return source.icon_url ?? getAvatarFallback( source );
};


export {
  getHeadingSlots,
  getLogo,
  getSourceCopy,
  getAvatarFallback,
  getAvatar,
}
