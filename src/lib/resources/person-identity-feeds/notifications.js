import * as Notifications from "$lib/resources/person-identity-feeds/_notifications.js";
import { Cache } from "$lib/resources/cache.js";

// The following classes play an HTTP intermediary role. They are focused on
// RESTful composition that stablizes this client's request pattern to the GOBO
// HTTP API while building an integrative layer that provides a unified feed as
// a transparent interface.


class Reader {
  constructor ({ identity, per_page, client, view }) {
    this.identity = identity;
    this.id = identity.id
    this.per_page = per_page ?? 50;
    this.view = view;
    this.head = null;
    this.tail = null;
    this.queue = [];
    this.unlocksAt = null;
  }

  static async create ({ identity, per_page, view }) {
    per_page = per_page ?? 50;
    return new Reader({ identity, per_page, view });
  }

  getOptions () {
    return {
      id: this.id,
      per_page: this.per_page,
      start: this.tail,
      view: this.view
    };
  }

  async page () {
    const graph = await Notifications.list( this.getOptions() );
    if ( !graph ) {
      return; // Bail if we run into an authorization problem.
    }

    // Prepare the raw graph for integration into application state.
    const weave = weaveGraph( graph );

    // Store graph state in the application cache.
    Cache.putPosts( weave.posts );
    Cache.putSources( weave.sources );
    Cache.decorateMastodon( Object.keys(weave.posts) );
    Cache.putPostEdges( this.id, weave.postEdges );
    Cache.putNotifications( weave.notifications );


    // Almost done. Place results into outer interface and ready next cycle.
    const feed = [];
    for ( const id of weave.feed ) {
      feed.push( weave.notifications[id] );
    }
    this.queue.push( ...feed );
    this.head = this.queue[0]?.notified;
    this.tail = graph.next;
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

  // Fetch the next highest notification.
  async next () {
    await this.checkQueue()
    const notification = this.queue.shift();
    this.head = this.queue[0]?.notified;
    return { 
      identity: this.id, 
      baseURL: this.identity.base_url,
      notification 
    };
  }
}




class Feed {
  constructor ({ readers }) {
    this.readers = readers;
  }

  static async create ({ identities, view }) {
    const readers = [];
    for ( const identity of identities ) {
      readers.push( await Reader.create({ identity, view }) );
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

  // Fetch the next highest scoring notification from the reader with the highest head.
  async next () {
    const reader = await this.getNextReader();
    
    if ( reader == null ) {
      return null
    } else {
      return await reader.next();
    }
  }
}


// TODO: I copied this from the filter engine interface and modififed. This needs
// to be a part of the refactor.
const weaveGraph = function ( graph ) {
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


export {
  Feed
}