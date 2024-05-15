import { Draft } from "$lib/engines/draft.js";
import { Delivery } from "$lib/engines/delivery.js";
import { Validate } from "$lib/engines/platforms/validate.js";
import { Bluesky } from "$lib/engines/platforms/bluesky.js";
import { Linkedin } from "$lib/engines/platforms/linkedin.js";
import { Mastodon } from "$lib/engines/platforms/mastodon.js";
import { Reddit } from "$lib/engines/platforms/reddit.js";
import { Smalltown } from "$lib/engines/platforms/smalltown.js";
import * as File from "$lib/resources/draft-file.js";
import * as Post from "$lib/resources/post.js";


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


const Publish = {};

Publish.build = ( draft ) => {
  const post = {};
  post.content = draft.content;
  post.title = draft.options?.general?.title ?? undefined;
  // post.poll = {};
  return post;
};


Publish.uploadAttachments = async ( uploads ) => {
  let earlyReturn = false;
  const ids = [];
  for ( const upload of uploads ) {
    try {
      const file = await File.create( upload );
      ids.push( file.id );
      upload.state = "uploaded";
      Delivery.updateAspect( "uploads", uploads );
    } catch ( error ) {
      console.error( error );
      upload.state = "error";
      earlyReturn = true;
      break;
    }
  }

  if ( earlyReturn ) {
    for ( const upload of uploads ) {
      if ( upload.state === "pending" ) {
        upload.state = "aborted"
      }
    }
    throw new Error();
  }

  return ids;
};


Publish.buildTargets = async ( draft ) => {
  const targets = [];
  for ( const identity of draft.identities ) {
    if ( identity.active === true ) {
      try {
        const metadata = await Metadata.build( identity, draft );
        targets.push({ identity: identity.id, metadata });
      } catch ( error ) {
        console.error( error );
        Delivery.pushAlert( `Unable to prepare post for platform ${ identity?.platform }.` );
        targets.push( false );
      }
    }
  }

  return targets;
};


Publish.start = async function ( delivery ) {
  let post, targets;
  const delivery = frame.delivery;

  try {
    post = Publish.build( delivery.draft );
  } catch ( error ) {
    console.error( error );
    frame.pushAlert( "There was a problem assembling post data." );
    return;
  }

  try {
    post.attachments = await Publish.uploadAttachments( delivery.uploads );
  } catch ( error ) {
    frame.pushAlert( "Failed to upload images." );
    return;
  }
  
  targets = await Publish.buildTargets( delivery.draft );
  if ( targets.includes( false )) {
    return;
  }
 
  try {
    const { id } = await Post.publish( post, targets );
    delivery.id = id;
    frame.update( delivery );
    return frame;
  } catch ( error ) {
    console.error( error );
    frame.pushAlert( "Failed to submit post to Gobo API." );
    return;
  }
};




export {
  Publish
}