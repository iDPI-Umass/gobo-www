import { getGOBOClient, logout } from "$lib/helpers/account";
import { Cache, cache } from "$lib/resources/cache.js";

// The following classes play an HTTP intermediary role. They are focused on
// RESTful composition that stablizes this client's request pattern to the GOBO
// HTTP API while building an integrative layer that provides a unified feed as
// a transparent interface.


class Reader {
  constructor ({ identity, filters, per_page, client }) {
    this.identity = identity;
    this.filters = filters;
    this.id = identity.id
    this.per_page = per_page ?? 50;
    this.client = client;
    this.head = null;
    this.tail = null;
    this.queue = [];
    this.unlocksAt = null;
  }

  static async create ({ identity, filters, per_page }) {
    const client = await getGOBOClient();
    per_page = per_page ?? 50;
    return new Reader({ identity, filters, per_page, client });
  }

  async page () {
    try {
      const result = await this.client.personIdentityFeed.get({ 
        person_id: this.client.id,
        id: this.id,
        per_page: this.per_page,
        start: this.tail
      });

      applyFilters( this.filters, result );
      console.log(result)

      const feed = [];
      const posts = {};
      const sources = {};
      const postEdges = {};

      for ( const post of result.posts ) {
        posts[ post.id ] = post;
      }
      for ( const share of result.shares ?? [] ) {
        posts[ share[0] ].shares ??= [];
        posts[ share[0] ].shares.push( share[1] );
      }
      for ( const reply of result.replies ?? [] ) {
        posts[ reply[0] ].reply = reply[1];
      }
      for ( const source of result.sources ) {
        sources[ source.id ] = source;
      }
      
      decorateMastodon( this.identity, result.feed, sources, posts );
      
      for ( const edge of result.post_edges ?? [] ) {
        postEdges[ edge[0] ] ??= new Set();
        postEdges[ edge[0] ].add( edge[1] );
      }
      for ( const id of result.feed ) {
        Cache.addPostCenter( id );
        feed.push( posts[ id ] );
      }

      this.queue.push( ...feed );
      this.head = this.queue[0]?.published;
      this.tail = result.next;
      Cache.putPosts( posts );
      Cache.putSources( sources );
      Cache.putPostEdges( this.id, postEdges );

    } catch (error) {
      if ( error.status === 401 ) {
        await logout();
      } else {
        throw error;
      }
    }
  }

  lock () {
    const date = new Date();
    date.setUTCSeconds( date.getUTCSeconds() + 60 );
    this.unlocksAt = date.toISOString();
  }

  isLocked () {
    return this.unlocksAt != null;
  }
  
  isLockExpired () {
    if ( this.unlocksAt == null ) {
      throw new Error("reader lock expiration is undefined when reader lock is undefined")
    }

    const now = (new Date).toISOString();
    if ( now > this.unlocksAt ) {
      return true;
    } else {
      return false;
    }
  }

  unlock () {
    this.unlocksAt = null;
  }

  isEmpty () {
    return this.queue.length === 0;
  }

  // Ensures the queue is not empty by pulling the next page, if neccessary.
  // We avoid spamming the API with a throttling lock.
  async checkQueue () {
    if ( this.isLocked() ) {
      if ( this.isLockExpired() ) {
        this.unlock();
      } else {
        return;
      }
    }

    if ( this.isEmpty() ) {
      await this.page();
    }

    if ( this.isEmpty() ) {
      this.lock();
    }
  }

  async getHead () {
    if ( this.head == null ) {
      await this.checkQueue();
    }
    return this.head;
  }

  // Fetch the next highest post.
  async next () {
    await this.checkQueue()
    const post = this.queue.shift();
    this.head = this.queue[0]?.published;
    return { identity: this.id, post };
  }
}




class Feed {
  constructor ({ readers }) {
    this.readers = readers;
  }

  static async create ({ identities, filters }) {
    const readers = [];
    for ( const identity of identities ) {
      readers.push( await Reader.create({ identity, filters }) );
    }

    return new Feed({ readers });
  }

  async getActiveReaders () {
    const readers = [];

    // If we need to make any requests to the API, make them in parallel.
    const promises = [];
    for ( const reader of this.readers ) {
      promises.push(reader.getHead());
    }
    await Promise.all( promises );
    
    // Now we can safely assume `.head` is an up-to-date value.
    for ( const reader of this.readers ) {
      if ( reader.head != null ) {
        readers.push( reader );
      }
    }

    return readers;
  }

  // Fetch the reader with the highest head.
  async getNextReader () {
    let match = null;
    const readers = await this.getActiveReaders();
    for ( const reader of readers ) {
      if ( match == null || reader.head > match.head ) {
        match = reader;
      }
    }
    return match;
  }

  // Fetch the next highest scoring post from the reader with the highest head.
  async next () {
    const reader = await this.getNextReader();
    
    if ( reader == null ) {
      return null
    } else {
      return await reader.next();
    }
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

const decorateMastodon = function ( identity, feed, sources, posts ) {
  if ( ! ["mastodon", "smalltown"].includes(identity.platform) ) {
    return;
  }

  for ( const id of feed ) {
    const post = posts[ id ];
    const postHostname = new URL(post.base_url).hostname;
    const source = sources[ post.source_id ];
    const sourceHostname = source.username.split("@").at(-1);
    if ( postHostname === sourceHostname ) {
      continue;
    }

    const path = `/@${source.username}/${post.platform_id}`;
    post.proxyURL = new URL( path, identity.base_url ).href;
  }
};





const applyFilters = function ( filters, graph ) {
  const removals = [];
  const sources = {};
  for ( const source of graph.sources ) {
    sources[ source.username ] = source;
  }

  // Cycle through every individual post looking for exclusions.
  for ( const post of graph.posts ) {
    for ( const filter of filters ) {
      const doesPass = filter.check({ post, sources });
      if ( doesPass !== true ) {
        removals.push( post.id );
        continue;
      }
    }
  }

  console.log(`filtered ${removals.length} posts`);


  // TODO: This still allows posts to be shown in the graph of filtered posts.
  // For example, showing the quote post content of a blocked post. Is
  // this desirable? There's a delegated design question regarding showing
  // nothing vs showing that the filter is doing something in the feed.


  // Purge the graph of all exclusions.
  const posts = [];
  for ( const post of graph.posts ) {
    if ( removals.includes(post.id) ) {
      continue;
    }
    posts.push( post );
  }
  graph.posts = posts;

  // Purge the feed of all exclusions.
  const feed = [];
  for ( const id of graph.feed ) {
    if ( removals.includes(id) ) {
      continue;
    }
    feed.push( id );
  }
  graph.feed = feed;

  // Purge graph egdes of all exclusions.
  const shares = []
  for ( const share of graph.shares ) {
    if ( removals.includes(share[0]) || removals.includes(share[1]) ) {
      continue;
    }
    shares.push( share );
  }
  graph.shares = shares;

  const replies = []
  for ( const reply of graph.replies ) {
    if ( removals.includes(reply[0]) || removals.includes(reply[1]) ) {
      continue;
    }
    replies.push( reply );
  }
  graph.replies = replies;
};




export {
  Feed
}