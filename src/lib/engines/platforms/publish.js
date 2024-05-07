import { Draft } from "$lib/engines/draft.js";
import { Validate } from "$lib/engines/platforms/validate.js";
import { Bluesky } from "$lib/engines/platforms/bluesky.js";
import { Linkedin } from "$lib/engines/platforms/linkedin.js";
import { Mastodon } from "$lib/engines/platforms/mastodon.js";
import { Reddit } from "$lib/engines/platforms/reddit.js";
import { Smalltown } from "$lib/engines/platforms/smalltown.js";
import * as Image from "$lib/resources/draft-file.js";
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


Publish.uploadAttachments = async ( draft ) => {
  const ids = [];
  for ( const attachment of draft.attachments ) {
    const image = await Image.create( attachment );
    ids.push( image.id );
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
        Draft.pushAlert( `Unable to prepare post for platform ${ identity?.platform }.` );
        targets.push( false );
      }
    }
  }
  return targets;
};


Publish.flow = async function ( draft ) {
  let post, targets;
  
  try {
    post = Publish.build( draft );
  } catch ( error ) {
    console.error( error );
    Draft.pushAlert( "Unable to build post base." );
    return { success: false };
  }

  try {
    post.attachments = await Publish.uploadAttachments( draft );
  } catch ( error ) {
    console.error( error );
    if ( error.status === 413 ) {
      Draft.pushAlert( "Image was too large to upload" );
    } else {
      Draft.pushAlert( "Failed to upload images." );
    }
    return { success: false };
  }
  
  targets = await Publish.buildTargets( draft );
  if ( targets.includes( false )) {
    return { success: false };
  }
 
  try {
    await Post.publish( post, targets );
    return { success: true };
  } catch ( error ) {
    console.error( error );
    Draft.pushAlert( "Failed to submit post to Gobo API." );
    return { success: false };
  }
};


export {
  Publish
}