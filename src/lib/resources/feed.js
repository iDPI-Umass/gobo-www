import { getGOBOClient, logout } from "$lib/helpers/account";

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
    this.tail = (new Date).toISOString();
    this.queue = [];
    this.hold = null;
  }

  static async create ({ identity, per_page }) {
    const client = await getGOBOClient();
    per_page = per_page ?? 50;
    const self = new Reader({ identity, per_page, client });
    await self.page(); // Primes internal queue.
    return self;
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
      this.head = this.queue[0]?.published
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

  setHold () {
    const date = new Date();
    date.setUTCSeconds( date.setUTCSeconds + 60 );
    this.hold = date.toISOString();
  }

  hasHold () {
    const now = (new Date).toISOString();
    if ( this.hold != null && this.hold > now ) {
      return true;
    } else {
      return false;
    }
  }


  async next () {
    if ( this.queue.length === 0 && this.hasHold() === false ) {
      await this.page();
      if ( this.queue.length === 0 ) {
        this.setHold();
        return null;
      }
    }

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

  get youngest () {
    let match = null;
    for ( const reader of this.readers ) {
      if ( match == null || reader.head > match.head ) {
        match = reader;
      }
    }
    return match;
  }

  async next () {
    const reader = this.youngest;
    return await reader.next();
  }
}



export {
  Feed,
  Cache
}