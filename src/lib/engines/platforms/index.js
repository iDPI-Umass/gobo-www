import { Identity } from "$lib/engines/draft.js";

import { Bluesky } from "$lib/engines/platforms/bluesky.js";
import { Linkedin } from "$lib/engines/platforms/linkedin.js";
import { Mastodon } from "$lib/engines/platforms/mastodon.js";
import { Reddit } from "$lib/engines/platforms/reddit.js";
import { Smalltown } from "$lib/engines/platforms/smalltown.js";

import { Validate } from "$lib/engines/platforms/validate.js";
import { Publish } from "$lib/engines/platforms/publish.js";


const Platforms = {};

Platforms.get = ( name ) => {
  switch ( name ) {
    case "bluesky":
      return Bluesky;
    case "linkedin":
      return Linkedin;
    case "mastodon":
      return Mastodon;
    case "reddit":
      return Reddit;
    case "smalltown":
      return Smalltown;
    default:
      throw new Error( `unknown platform ${name}` );
  }
}

Platforms.displayName = ( name ) => {
  const model = Platforms.get( name );
  return model.displayName;
};

Platforms.getAcceptable = () => {
  const identities = Identity.list().filter( i => i.active === true );
  const platforms = new Set();
  for ( const identity of identities ) {
    platforms.add( identity.platform );
  }

  // Default behavior is to show acceptable MIME types across *ALL* platforms.
  if ( platforms.size === 0 ) {
    platforms.add( "bluesky" );
    platforms.add( "linkedin" );
    platforms.add( "mastodon" );
    platforms.add( "reddit" );
    platforms.add( "smalltown" );
  }
  
  const types = new Set();
  for ( const name of platforms ) {
    const platform = Platforms.get( name );
    const image = platform.limits.image?.types ?? [];
    for ( const type of image ) {
      types.add( type );
    }
    const audio = platform.limits.audio?.types ?? [];
    for ( const type of audio ) {
      types.add( type );
    }
    const video = platform.limits.video?.types ?? [];
    for ( const type of video ) {
      types.add( type );
    }
    const document = platform.limits.document?.types ?? [];
    for ( const type of document ) {
      types.add( type );
    }
  }

  return Array.from( types );
};


export {
  Platforms,

  Bluesky,
  Linkedin,
  Mastodon,
  Reddit,
  Smalltown,

  Validate,
  Publish
}