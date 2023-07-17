import { getGOBOClient, logout } from "$lib/helpers/account";

// The following classes play an HTTP intermediary role. They are focused on
// RESTful composition that stablizes this client's request pattern to the GOBO
// HTTP API while building an integrative layer that provides a unified feed as
// a transparent interface.


const cache = {
  posts: {},
  sources: {}
};



class Cache {
  static getPost ( id ) {
    return cache.posts[ id ];
  }

  static getSource ( id ) {
    return cache.sources[ id ];
  }
}



class Reader {
  constructor ({ identity, per_page, client }) {
    this.identity = identity;
    this.id = identity.id
    this.per_page = per_page ?? 50;
    this.client = client;
    this.head = null;
    this.tail = null;
    this.queue = [];
    this.unlocksAt = null;
  }

  static async create ({ identity, per_page }) {
    const client = await getGOBOClient();
    per_page = per_page ?? 50;
    return new Reader({ identity, per_page, client });
  }

  async page () {
    try {
      const result = await this.client.personIdentityFeed.get({ 
        person_id: this.client.id,
        id: this.id,
        per_page: this.per_page,
        start: this.tail
      });

      const feed = [];
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
      for ( const id of result.feed ) {
        feed.push( posts[ id ] );
      }

      this.queue.push( ...feed );
      this.head = this.queue[0]?.published;
      this.tail = result.next;
      Object.assign( cache.posts, posts );
      Object.assign( cache.sources, sources );

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
    if ( this.head != null ) {
      return this.head;
    } else {
      await this.checkQueue();
      return this.head;
    }
  }

  // Fetch the next highest post.
  async next () {
    await this.checkQueue()
    const post = this.queue.shift();
    this.head = this.queue[0]?.published;
    return post;
  }
}




class Feed {
  constructor ({ readers }) {
    this.readers = readers;
    this.posts = {};
    this.sources = {};
    this.feed = [];
  }

  static async create ({ identities }) {
    const readers = [];
    for ( const identity of identities ) {
      readers.push( await Reader.create({ identity }) );
    }

    return new Feed({ readers });
  }

  async getActiveReaders () {
    const readers = [];
    for ( const reader of this.readers ) {
      const head = await reader.getHead();
      if ( head != null ) {
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



export {
  Feed,
  Cache
}