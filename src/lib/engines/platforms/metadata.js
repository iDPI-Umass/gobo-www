import { Bluesky } from "$lib/engines/platforms/bluesky.js";
import { Linkedin } from "$lib/engines/platforms/linkedin.js";
import { Mastodon } from "$lib/engines/platforms/mastodon.js";
import { Reddit } from "$lib/engines/platforms/reddit.js";
import { Smalltown } from "$lib/engines/platforms/smalltown.js";


const Metadata = {};

// The terminology has some tree rings here, but the idea is that there are
// several entities at play here. Humans interact with the Gobo client to
// author drafts. We're interested in rendering its information architecture
// in the client, storing it so it's recoverable, and using it as the source.
//
// Separately, we have "targets" that are projections off of the draft state,
// specific for a given target identity. The transformations involved are
// arbitrary, we do what we must to map into the target platform's format.
// We want to use cloning to prevent any mutations leaking back into the draft.
//
// And then finally, the delivery holds all this together, including the media,
// and makes it targetable for inspection later.
Metadata.build = async ( identity, _draft ) => {
  const draft = structuredClone( _draft );

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