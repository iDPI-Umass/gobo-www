const cache = {
  posts: {},
  postCenters: new Set(),
  sources: {},
  postEdges: {}
};

class Cache {
  static hasPostCenter ( id ) {
    return cache.postCenters.has( id );
  }

  static addPostCenter ( id ) {
    cache.postCenters.add( id );
  }

  static getPost ( id ) {
    return cache.posts[ id ];
  }

  static putPosts ( posts ) {
    Object.assign( cache.posts, posts );
  }

  static getSource ( id ) {
    return cache.sources[ id ];
  }

  static putSources ( sources ) {
    Object.assign( cache.sources, sources );
  }

  static getPostEdge ( identity, post ) {
    cache.postEdges[ identity ][ post ] ??= new Set();
    return cache.postEdges[ identity ][ post ];
  }

  static putPostEdges ( id, edges ) {
    cache.postEdges[ id ] ??= {};
    Object.assign( cache.postEdges[id], edges );
  }
} 

export {
  cache,
  Cache
}