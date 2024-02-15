const cache = {
  posts: {},
  postCenters: new Set(),
  sources: {},
  notifications: {},
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

  static getNotification( id ) {
    return cache.notifications[ id ];
  }

  static putNotifications ( notifications ) {
    Object.assign( cache.notifications, notifications );
  }

  static getPostEdge ( identity, post ) {
    cache.postEdges[ identity ][ post ] ??= new Set();
    return cache.postEdges[ identity ][ post ];
  }

  static putPostEdges ( id, edges ) {
    cache.postEdges[ id ] ??= {};
    Object.assign( cache.postEdges[id], edges );
  }

  static decorateMastodon ( ids ) {
    for ( const id of ids ) {
      decorateMastodon( id );
    }
  }

  static mergeWeave ( identity, weave ) {
    for ( const id of weave.feed ) {
      Cache.addPostCenter( id );
    }
    Cache.putPosts( weave.posts );
    Cache.putSources( weave.sources );
    Cache.decorateMastodon( Object.keys(weave.posts) );
    Cache.putPostEdges( identity.id, weave.postEdges );
  }
}


// Special case for Mastodon and Smalltown. Because they are federated, their posts
// have both originating and "proxied" URLs from the hosting server. For now,
// we're addressing that by decorating the relevant posts.
// TODO:  Should the proxied URL be the one and only canonical URL or should
//        GOBO's abstract post accomodate this somehow in its data structure?
//        This is somewhat related to solving this resource resolution problem
//        generally in Mastodon's federation model. They're not true aliases
//        because the resource is "deeply copied" across the federation.

const decorateMastodon = function ( id ) {
  const post = Cache.getPost( id );
  const source = Cache.getSource( post.source_id );

  if ( source.platform === "mastodon" ) {
    const postHostname = new URL(post.base_url).hostname;
    const sourceHostname = source.username.split("@").at(-1);
    if ( postHostname !== sourceHostname ) {
      const path = `/@${source.username}/${post.platform_id}`;
      post.proxyURL = new URL( path, source.base_url ).href;
    }

  } else if ( source.platform === "smalltown" ) {
    const path = `/web/statuses/${post.platform_id}`;
    post.proxyURL = new URL( path, source.base_url ).href;
  } 
};



export {
  cache,
  Cache,
  decorateMastodon
}