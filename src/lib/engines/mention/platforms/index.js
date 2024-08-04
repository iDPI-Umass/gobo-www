import { Bluesky } from "$lib/engines/mention/platforms/bluesky.js";
import { Linkedin } from "$lib/engines/mention/platforms/linkedin.js";
import { Mastodon } from "$lib/engines/mention/platforms/mastodon.js";
import { Reddit } from "$lib/engines/mention/platforms/reddit.js";
import { Smalltown } from "$lib/engines/mention/platforms/smalltown.js";

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

export {
  Platforms
}