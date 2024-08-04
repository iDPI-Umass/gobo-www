// This regex from the Mastodon codebase points to mention rules. However, we
// don't need such a general form because we've already isolated the mention.
// https://github.com/mastodon/mastodon/blob/19f4aa11472eb5bedd97e0541a48126078715193/app/models/account.rb#L70-L71

const Mastodon = {};

Mastodon.mentionFromName = ( name = "" ) => {
  return name;
};

Mastodon.isHandle = ( string = "" ) => {
  const baseRules = /^@[a-z0-9_.-]+(@[a-z0-9_.-]+)?$/i.test(string)

  if (!baseRules) {
    return false;
  }

  const parts = string
    .split( "@" )
    .slice( 1 )
    .map( s => s.split( "." ))
    .flat();
  
  return parts.every( part => part.length >= 1 ) &&
    parts.every( label => /^[^-]/.test(label) ) &&
    parts.every( label => /[^-]$/.test(label) )
};

Mastodon.resolveType = ( string ) => {
  if ( Mastodon.isHandle(string) ) {
    return "handle";
  } else {
    return "placeholder";
  }
}

export {
  Mastodon
}