import { getGOBOClient, logout } from "$lib/helpers/account";
import { Cache } from "$lib/resources/cache.js";
import * as Image from "$lib/resources/draft-image.js";
import * as FeedSaver from "$lib/engines/feed-singleton.js";
import { Draft, Metadata } from "$lib/engines/draft.js";


const get = async function ({ identity, id }) {
  if ( Cache.hasPostCenter(id) ) {
    return Cache.getPost( id );
  }

  let graph, weave;
  try {
    const client = await getGOBOClient();
    graph = await client.personIdentityPost.get({ 
      person_id: client.id,
      identity_id: identity,
      id 
    });

  } catch (error) {
    if ( error.status === 401 ) {
      await logout();
      return {};
    } else {
      throw error;
    }
  }

  try {
    const engine = await FeedSaver.getEngine();
    const filterEngine = engine.filterEngine;
    filterEngine.filterPrimary( graph );
    console.log( "filtered graph", graph );
  
    weave = filterEngine.weaveGraph( graph );
    filterEngine.filterTraversals( weave );
    Cache.mergeWeave({ id: identity }, weave );
  
    return weave.posts[ weave.feed[0] ];
  } catch (error) {
    console.error(error);
  }
};



const Post = {};

Post.build = ( draft ) => {
  const post = {};
  post.content = draft.content;
  post.title = draft.options?.title ?? undefined;
  // post.poll = {};
  return post;
};


Post.uploadAttachments = async ( draft ) => {
  const ids = [];
  for ( const attachment of draft.attachments ) {
    const image = await Image.create( attachment );
    ids.push( image.id );
  }
  return ids;
};


Post.buildTargets = async ( draft ) => {
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


Post.submit = async ( post, targets ) => {
  const client = await getGOBOClient();
  await client.personPosts.post({ 
    parameters: { person_id: client.id },
    content: { post, targets }   
  });
};



const publish = async function ( draft ) {
  let post, targets;
  
  try {
    post = Post.build( draft );
  } catch ( error ) {
    console.error( error );
    Draft.pushAlert( "Unable to build post base." );
    return { success: false };
  }

  try {
    post.attachments = await Post.uploadAttachments( draft );
  } catch ( error ) {
    console.error( error );
    Draft.pushAlert( "Failed to upload images." );
    return { success: false };
  }
  
  targets = await Post.buildTargets( draft );
  if ( targets.includes( false )) {
    return { success: false };
  }
 
  try {
    await Post.submit( post, targets );
    return { success: true };
  } catch ( error ) {
    console.error( error );
    Draft.pushAlert( "Failed to submit post to Gobo API." );
    return { success: false };
  }
};


export {
  get,
  publish
}