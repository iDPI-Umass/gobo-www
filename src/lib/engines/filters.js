import * as Filter from "$lib/resources/filter.js";

/***
The identities form part of the rankers that provide posts to the feed engine
intermediary. These filters are the counterpart to rankers, excluding feeds
based on configured conditions.

We have a similar need to avoid consensus issues, so this interface will look
similar to the IdentityEngine.
 ***/

class FilterEngine {
  constructor ({ filters }) {
    this.filters = filters;
  }

  static async create () {
    const filters = await Filter.list();
    return new FilterEngine({ filters });
  }

  getActiveFilters () {
    const active = [];
    for ( const filter of this.filters ) {
      if ( filter.active === true ) {
        active.push( filter );
      }
    }
    return active;
  };

  getRunners () {
    this.runners = [];
    for ( const filter of this.filters ) {
      switch ( filter.category ) {
        case "block-keyword":
          this.runners.push( new BlockKeyword({ filter }) );
          break;
        case "block-username":
          this.runners.push( new BlockUsername({ filter }) );
          break;
        case "block-domain":
          this.runners.push( new BlockDomain({ filter }) );
          break;
        default:
          console.error("unknown filter category", filter);
      }
    }

    return this.runners;
  }
  

  setActiveState ( filter, active ) {
    const match = this.filters.find( i => i.id === filter.id );
    if ( match == null ) {
      throw Error(`did not find match for filter ${filter.id}`);
    }
    match.active = active;
    // This is asynchronous, but we let it just run without awaiting for now.
    Filter.update( match );
  };

  async addFilter ( category, configuration ) {
    const filter = await Filter.add( category, configuration );
    this.filters.push( filter );
  }

  updateFilter ( filter ) {
    const match = this.filters.find( i => i.id === filter.id );
    if ( match == null ) {
      throw Error(`did not find match for filter ${filter.id}`);
    }
    match.category = filter.category;
    match.active = filter.active;
    match.configuration = filter.configuration;
    // This is asynchronous, but we let it just run without awaiting for now.
    Filter.update( match );
  }

  removeFilter ( filter ) {
    const index = this.filters.findIndex( i => i.id === filter.id );
    const match = this.filters.splice(index, 1)[0]
    // This is asynchronous, but we let it just run without awaiting for now.
    Filter.remove( match );
  }



  filterPrimary ( graph ) {
    const filters = this.runners.filter( r => r.active === true);
    const removals = new Set();
    const now = new Date().toISOString();
    
    const sources = {};
    for ( const source of graph.sources ) {
      if ( source.platform === "reddit" ) {
        sources[ source.name.toLowerCase() ] = source;
      } else {
        sources[ source.username.toLowerCase() ] = source;
      }
    }

    

    // Cycle through every individual post looking for posts to exclude.
    for ( const post of graph.posts ) {
      
      // Remove impossible date anomalies.
      if ( post.published > now ) {
        removals.add( post.id );
        continue;
      }
  
      for ( const filter of filters ) {
        const doesPass = filter.check({ post, sources });
        if ( doesPass !== true ) {
          removals.add( post.id );
          continue;
        }
      }
    }
  
    console.log(`filtered ${removals.size} posts`);
  
  
    // Now that we know all exclusions, purge them from post array...
    const posts = [];
    for ( const post of graph.posts ) {
      if ( removals.has(post.id) ) {
        continue;
      }
      posts.push( post );
    }
    graph.posts = posts;
  
    // ...and from the feed array.
    const feed = [];
    for ( const id of graph.feed ) {
      if ( removals.has(id) ) {
        continue;
      }
      feed.push( id );
    }
    graph.feed = feed;
  
  
    // Examine effects on 1st-order graph edges.
    const shares = [];
    for ( const share of graph.shares ) {
      if ( removals.has(share[0]) ) {
        continue;
      }
      if ( removals.has( share[1]) ) {
        shares.push([ share[0], "gobo-filtered-post" ]);
        continue;
      }
      shares.push( share );
    }
    graph.shares = shares;
  
    const threads = [];
    for ( const thread of graph.threads ) {
      if ( removals.has(thread[0]) ) {
        continue;
      }
      if ( removals.has( thread[1]) ) {
        threads.push([ thread[0], "gobo-filtered-post" ]);
        continue;
      }
      threads.push( thread );
    }
    graph.threads = threads;
    
  
    // Return the removed posts so the engine can decide what to do next.
    return removals;
  }

  // TODO: Where does this go? We'd like to express a repeatable way to assemble
  // feeds and threads while being mindful of the filter configuration.
  // However, control flow interferes with composition.
  weaveGraph ( graph ) {
    const feed = [ ...graph.feed ];
    const posts = {};
    const sources = {};
    const postEdges = {};

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

    return {
      feed,
      posts,
      sources,
      postEdges
    };
  }




  // The current filters act on individual posts, with consequences for their
  // immediate graph edges. Once all that is done, we can examine the resulting
  // graph and look for traversal structures that need further action.
  filterTraversals ( weave ) {
    const removals = new Set();
    for ( const id of weave.feed ) {
      const post = weave.posts[ id ];

      // Reposts
      if ( hasNoContent(post) && post.shares?.length > 0 ) {
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
  }
}



// From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
const escapeRegex = function ( string ) {
  return string.replace(
    /[.*+?^${}()|[\]\\]/g,  // various special regex characters to escape
    "\\$&"                  // references whole matched string 
  ); 
};





// The filters have a serializable representation in the HTTP API, but we need
// to instantiate them for repeated use in the FeedEngine weaver itself. These
// classes hold neccessary context and provide a uniform evaluation interface.

class BlockKeyword {
  constructor ({ filter }) {
    this.filter = filter;
    const input = escapeRegex( filter.configuration.value );
    this.re = new RegExp( input + "('|('s))?", "i" );
  }

  get active () {
    return this.filter.active;
  }

  check ({ post }) {
    if ( post.content != null ) {
      if ( this.re.test(post.content) === true ) {
        return false;
      }
    }

    if ( post.title != null ) {
      if ( this.re.test(post.title) === true ) {
        return false;
      }
    }

    for ( const attachment of post.attachments ?? [] ) {
      if ( attachment.type === "application/json+gobo-syndication" ) {
        if ( attachment.description != null ) {
          if ( this.re.test(attachment.description) === true ) {
            return false;
          }
        }
        
        if ( attachment.title != null ) {
          if ( this.re.test(attachment.title) === true ) {
            return false;
          }
        }
      }
    }

    for ( const option of post.poll?.options ?? [] ) {
      if ( option.key != null ) {
        if ( this.re.test(option.key) === true ) {
          return false;
        }
      }
    }

    return true;
  }
}

class BlockUsername {
  constructor ({ filter }) {
    this.filter = filter;
    
    const value = filter.configuration.value;
    this.value = value;

    if ( value.startsWith("@") ) {
      this.username = value.slice(1).toLowerCase();
    } else if ( value.startsWith("r/") ) {
      this.username = value.slice(2).toLowerCase();
    } else {
      this.username = value.toLowerCase();
    }
  }

  get active () {
    return this.filter.active;
  }

  check ({ post, sources }) {
    const source = sources[ this.username ];
    if ( source != null ) {
      if ( source.id === post.source_id ) {
        return false;
      }
    }

    return true;
  }
}

class BlockDomain {
  constructor ({ filter }) {
    this.filter = filter;
    let value = filter.configuration.value;
    
    if ( !value.startsWith("http") ) {
      value = `https://${value}`;
    }

    // Isolate the domain so we can precisely match subdomains.
    // filter = www.example.com
    //    excludes: 
    //      www.example.com
    //      sub.www.example.com
    //    allows:  
    //      example.com
    //      sites.example.com
    //      myexample.com
    const domain = new URL(value).hostname
    this.re = new RegExp("(^|\\.)" + escapeRegex(domain) + "$", "i");
    
    this.matchesDomain = function ( url ) {
      return this.re.test( new URL(url).hostname );
    };
  }

  get active () {
    return this.filter.active;
  }


  check ({ post }) {
    if ( post.content != null ) {
      if ( this.re.test(post.content) === true ) {
        return false;
      }
    }

    if ( post.url != null ) {
      if ( this.matchesDomain(post.url) === true ) {
        return false;
      }
    }
    
    for ( const attachment of post.attachments ?? [] ) {
      if ( attachment.type === "application/json+gobo-syndication" ) {
        if ( attachment.source != null ) {
          if ( this.matchesDomain(attachment.source) === true ) {
            return false;
          }
        }
      }
    }

    return true;
  }
}



const hasNoContent = function ( post ) {
  return post.content == null || post.content === "";
}

export {
  FilterEngine
}