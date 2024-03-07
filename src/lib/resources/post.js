import { getGOBOClient, logout } from "$lib/helpers/account";
import { Cache } from "$lib/resources/cache.js";
import * as FeedSaver from "$lib/engines/feed-singleton.js";


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



const publish = async ( post, targets ) => {
  const client = await getGOBOClient();
  await client.personPosts.post({ 
    parameters: { person_id: client.id },
    content: { post, targets }   
  });
};


export {
  get,
  publish
}