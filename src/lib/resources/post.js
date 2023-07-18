import { getGOBOClient, logout } from "$lib/helpers/account";
import { cache, Cache } from "$lib/resources/cache.js";

const getPost = async function ( id ) {
  let post = Cache.getPost( id );
  if ( post != null ) {
    return post;
  }


  let result;
  try {
    const client = await getGOBOClient();
    result = await client.postGraph.get({ id });
  } catch (error) {
    if ( error.status === 401 ) {
      await logout();
      return {};
    } else {
      throw error;
    }
  }

  const posts = {};
  const sources = {};

  for ( const post of result.posts ) {
    posts[ post.id ] = post;
  }
  for ( const share of result.shares ) {
    posts[ share[0] ].shares ??= [];
    posts[ share[0] ].shares.push( share[1] );
  }
  for ( const source of result.sources ) {
    sources[ source.id ] = source;
  }
 

  Object.assign( cache.posts, posts );
  Object.assign( cache.sources, sources );
  
  return posts[ result.feed[0] ];
};

export {
  getPost
}