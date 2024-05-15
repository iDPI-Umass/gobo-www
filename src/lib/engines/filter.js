import * as Resource from "$lib/resources/filter.js";
import * as filterStores from "$lib/stores/filter.js";
import { App } from "$lib/engines/account.js";

/***
Filters have a serialized form we can pass around as state with the
HTTP API, but once we have them, we need to instanciate them and
prepare them for use inside the feed-weaving intermediary.

Like identity, we have a similar need to avoid consensus issues,
so we use the singleton pattern again.
***/

let singletonList;

const Filter = {};

Filter.make = ( filter ) => {
  switch ( filter.category ) {
    case "block-keyword":
      return BlockKeyword.make({ filter });
    case "block-username":
      return BlockUsername.make({ filter });
    case "block-domain":
      return BlockDomain.make({ filter });
    default:
      throw new Error("unknown filter category", filter);
  }
}

Filter.list = async () => {
  const list = await Resource.list();
  const filters = [];
  for ( const resource of list ) {
    filters.push( Filter.make( resource ));
  }
  return filters;
};

Filter.read = async () => {
  if ( singletonList == null ) {
    singletonList = Filter.list(); 
  }
  return singletonList = await singletonList;
};

Filter.write = () => {
  singletonList;
};

Filter.put = () => {
  filterStores.singleton.put( singletonList );
};


Filter.findIndex = async ( id ) => {
  const list = await Filter.read();
  const index = list.findIndex( f => f.id == id ); // TODO: Until we fix ID types.
  if ( index === -1 ) {
    throw new Error( `unable to find filter ${ id }` );
  }
  return index;
};

Filter.find = async ( id ) => {
  const list = await Filter.read();
  const match = list.find( f => f.id == id ); // TODO: Until we fix ID types.
  if ( match == null ) {
    throw new Error( `unable to find filter ${ id }` );
  }
  return match;
};

Filter.findCategory = async ( category ) => {
  const list = await Filter.read();
  return list.filter( f => f.category === category );
};

Filter.findActive = async () => {
  const list = await Filter.read();
  return list.filter( f => f.active === true );
};

Filter.findActiveCategory = async () => {
  const list = await Filter.read();
  return list
    .filter( f => f.category === category )
    .filter( f => f.active === true );
}

Filter.updateAll = () => {
  Filter.write();
  Filter.put();
};

Filter.load = async () => {
  await Filter.read();
  Filter.updateAll();
};

// These blend our instantiated runners with the need to use the HTTP interface.
// filter.filter is funky, but that awkwardness should be contained here.
Filter.update = async ( filter ) => {
  const list = await Filter.read();
  const index = await Filter.findIndex( filter.id );
  list.splice( index, 1, Filter.make( filter.filter ));
  Filter.updateAll();
  await Resource.update( filter.filter );
};

Filter.remove = async ( filter ) => {
  const list = await Filter.read();
  const index = await Filter.findIndex( filter.id );
  list.splice( index, 1 );
  Filter.updateAll();
  await Resource.remove( filter.filter );
};

Filter.add = async ( category, configuration ) => {
  const list = await Filter.read();
  const resource = await Resource.add( category, configuration );
  list.unshift( Filter.make( resource ));
  Filter.updateAll();
};



const Helpers = {};

// From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
Helpers.escapeRegex = ( string ) => {
  return string.replace(
    /[.*+?^${}()|[\]\\]/g,  // various special regex characters to escape
    "\\$&"                  // references whole matched string 
  ); 
};



Filter.primary = async ( graph ) => {
  const filters = await Filter.findActive();
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
};












// The filters have a serializable representation in the HTTP API, but we need
// to instantiate them for repeated use in the FeedEngine weaver itself. These
// classes hold neccessary context and provide a uniform evaluation interface.

class Frame {
  constructor({ filter }) {
    this.filter = filter;
    this.value = filter.configuration.value;
  }

  get id() {
    return this.filter.id;
  }

  get category() {
    return this.filter.category;
  }

  get active() {
    return this.filter.active;
  }

  set active ( active ) {
    this.filter.active = active;
  } 

  get value() {
    return this.filter.configuration.value;
  }

  set value ( value ) {
    this.filter.configuration.value = value;
  }
}

class BlockKeyword extends Frame {
  constructor ({ filter }) {
    super({ filter });
    const input = Helpers.escapeRegex( this.value );
    this.re = new RegExp( input + "('|('s))?", "i" );
  }

  static make ({ filter }) {
    return new BlockKeyword({ filter });
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

class BlockUsername extends Frame {
  constructor ({ filter }) {
    super({ filter });    
    const value = this.value;

    if ( value.startsWith("@") ) {
      this.username = value.slice(1).toLowerCase();
    } else if ( value.startsWith("r/") ) {
      this.username = value.slice(2).toLowerCase();
    } else {
      this.username = value.toLowerCase();
    }
  }

  static make ({ filter }) {
    return new BlockUsername({ filter });
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

class BlockDomain extends Frame {
  constructor ({ filter }) {
    super({ filter });
    let value = this.value;
    
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
    this.re = new RegExp("(^|\\.)" + Helpers.escapeRegex(domain) + "$", "i");
    
    this.matchesDomain = function ( url ) {
      return this.re.test( new URL(url).hostname );
    };
  }

  static make ({ filter }) {
    return new BlockDomain({ filter });
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




// Special instantiation, when logged in, to pull data and send to listeners.
// This cuts down on requests to the API and manages race conditions.
Filter.startup = async () => {
  if ( (await App.isAllowedAccess()) ) {
    await Filter.load();
  }
};

App.register( Filter.startup );
Filter.startup();


export {
  Filter,

  Frame,
  BlockKeyword,
  BlockUsername,
  BlockDomain
}