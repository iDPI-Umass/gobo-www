// TODO: What is this and where does this go? 
// We'd like to express a repeatable way to assemble
// feeds and threads while being mindful of the filter configuration.
// However, control flow interferes with composition.
const Weave = {}

Weave.make = ( graph ) => {
  const feed = [ ...graph.feed ];
  const posts = {};
  const sources = {};
  const postEdges = {};
  const notifications = {};

  for ( const post of graph.posts ) {
    posts[ post.id ] = post;
  }
  for ( const share of graph.shares ?? [] ) {
    posts[ share[0] ].shares ??= [];
    posts[ share[0] ].shares.push( share[1] );
  }
  for ( const thread of graph.threads ?? [] ) {
    posts[ thread[0] ].threads ??= [];
    posts[ thread[0] ].threads.push( thread[1] );
  }
  for ( const source of graph.sources ) {
    sources[ source.id ] = source;
  }
  for ( const edge of graph.post_edges ?? [] ) {
    postEdges[ edge[0] ] ??= new Set();
    postEdges[ edge[0] ].add( edge[1] );
  }
  for ( const notification of graph.notifications ?? [] ) {
    notifications[ notification.id ] = notification;
  }

  return {
    feed,
    posts,
    sources,
    postEdges,
    notifications
  };
};



Weave.hasNoContent = ( post ) => {
  return post.content == null || post.content === "";
};


// The primary filters we store and consider only act on individual posts,
// with consequences for their immediate graph edges. Once all that is done,
// we can examine the resulting graph/weave and look for traversal 
// structures that need further action.
Weave.trimTraversals = ( weave ) => {
  const removals = new Set();
  for ( const id of weave.feed ) {
    const post = weave.posts[ id ];

    // Reposts
    if ( Weave.hasNoContent(post) && post.shares?.length > 0 ) {
      if ( post.shares[0] === "gobo-filtered-post" ) {
        removals.add( id );
        continue;
      }
    }


    // Threads
    if ( post.threads?.length > 0 ) {
      // Oldest ancestor post. If filtered, we hide graph from feed only.
      if ( post.threads[0] === "gobo-filtered-post" ) {
        removals.add( id );
        continue;
      }
    }
  }

  weave.feed = weave.feed.filter( id => !removals.has(id) )
};



export {
  Weave
}