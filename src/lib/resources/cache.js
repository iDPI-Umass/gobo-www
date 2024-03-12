const singleton = {
  posts: {},
  sources: {},
  notifications: {},
  postEdges: {}
};

const Cache = {};

Cache.getPost = ( id ) => {
  return singleton.posts[ id ];
};

Cache.putPosts = ( posts ) => {
  Object.assign( singleton.posts, posts );
};

Cache.getSource = ( id ) => {
  return singleton.sources[ id ];
};

Cache.putSources = ( sources ) => {
  Object.assign( singleton.sources, sources );
};

Cache.getNotification = ( id ) => {
  return singleton.notifications[ id ];
};

Cache.putNotifications = ( notifications ) => {
  Object.assign( singleton.notifications, notifications );
};

Cache.getPostEdge = ( identity, post ) => {
  singleton.postEdges[ identity ][ post ] ??= new Set();
  return singleton.postEdges[ identity ][ post ];
};

Cache.putPostEdges = ( id, edges ) => {
  singleton.postEdges[ id ] ??= {};
  Object.assign( singleton.postEdges[id], edges );
};

Cache.mergeWeave = ( identity, weave ) => {
  Cache.putPosts( weave.posts );
  Cache.putSources( weave.sources );
  for ( const id of Object.keys( weave.posts )) {
    Mastodon.decorate( id );
  }
  Cache.putPostEdges( identity.id, weave.postEdges );
  Cache.putNotifications( weave.notifications ?? {} );
};


// Special case for Mastodon and Smalltown. Because they are federated, their posts
// have both originating and "proxied" URLs from the hosting server. For now,
// we're addressing that by decorating the relevant posts.
// TODO:  Should the proxied URL be the one and only canonical URL or should
//        GOBO's abstract post accomodate this somehow in its data structure?
//        This is somewhat related to solving this resource resolution problem
//        generally in Mastodon's federation model. They're not true aliases
//        because the resource is "deeply copied" across the federation.

const Mastodon = {};

Mastodon.decorate = ( id ) => {
  const post = Cache.getPost( id );
  const source = Cache.getSource( post.source_id );

  if ( source.platform === "mastodon" ) {
    const postHostname = new URL(post.base_url).hostname;
    const sourceHostname = source.username.split("@").at(-1);
    if ( postHostname !== sourceHostname ) {
      const sourcePath = `/@${ source.username }`;
      source.proxyURL = new URL( sourcePath, source.base_url ).href;
      const postPath = `${ sourcePath }/${ post.platform_id }`;
      post.proxyURL = new URL( postPath, source.base_url ).href;
    }

  } else if ( source.platform === "smalltown" ) {
    let path = `web/accounts/${ source.platform_id }`;
    source.proxyURL = new URL( path, source.base_url ).href;
    path = `/web/statuses/${ post.platform_id }`;
    post.proxyURL = new URL( path, source.base_url ).href;
  } 
};



export {
  singleton,
  Cache,
  Mastodon
}