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
        switch ( filter.category ) {
          case "block-keyword":
            active.push( new BlockKeyword({ filter }) );
            break;
          case "block-username":
            active.push( new BlockUsername({ filter }) );
            break;
          case "block-domain":
            active.push( new BlockDomain({ filter }) );
            break;
          default:
            console.error("unknown filter category", filter);
        }
      }
    }
    return active;
  };
  
  async refreshFilters () {
    this.filters = await Filter.list();
  };
  
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
    this.re = new RegExp( input, "i" );
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
    const domain = new URL(value).hostname
    
    this.matchesDomain = function ( url ) {
      return new URL( url ).hostname === domain
    };

    const input = escapeRegex( domain );
    this.re = new RegExp( input, "i" );
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

export {
  FilterEngine
}