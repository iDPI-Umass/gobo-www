import { Bluesky } from "$lib/engines/platforms/bluesky.js";
import { Linkedin } from "$lib/engines/platforms/linkedin.js";
import { Mastodon } from "$lib/engines/platforms/mastodon.js";
import { Reddit } from "$lib/engines/platforms/reddit.js";
import { Smalltown } from "$lib/engines/platforms/smalltown.js";


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


export {
  Metadata
}