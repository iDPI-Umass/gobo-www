
// Documentation here:
// https://atproto.com/specs/handle#handle-identifier-syntax

const Bluesky = {};

Bluesky.mentionFromName = ( name = "" ) => {
  // "Handles are not case-sensitive, and should be normalized to lowercase"
  return name.toLowerCase();
};

Bluesky.isHandle = ( string = "" ) => {
  const baseRules = /^@[a-z0-9.-]+$/i.test(string) &&
    (string.length < 253)

  if (!baseRules) {
    return false;
  }

  const labels = string.split( "." );
  return labels.length >= 2 &&
    labels.every( label => label.length >= 1 && label.length <= 63 ) &&
    labels.every( label => /^[^-]/.test(label) ) &&
    labels.every( label => /[^-]$/.test(label) )
};

Bluesky.resolveType = ( string ) => {
  if ( Bluesky.isHandle(string) ) {
    return "handle";
  } else {
    return "placeholder";
  }
}

export {
  Bluesky
}