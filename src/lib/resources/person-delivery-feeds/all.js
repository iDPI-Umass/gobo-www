import { Weave } from "$lib/engines/delivery/weave.js";
import * as Deliveries from "$lib/resources/person-delivery-feeds/_all.js";

// The following classes play an HTTP intermediary role. They are focused on
// RESTful composition that stablizes this client's request pattern to the GOBO
// HTTP API while building an integrative layer that provides a unified feed as
// a transparent interface.

class Reader {
  constructor ({ per_page }) {
    this.per_page = per_page ?? 50;
    this.head = null;
    this.tail = null;
    this.queue = [];
    this.unlocksAt = null;
  }

  static async make ({ per_page } = {}) {
    per_page = per_page ?? 50;
    return new Reader({ per_page });
  }

  getOptions () {
    return {
      per_page: this.per_page,
      start: this.tail,
    };
  }

  async page () {
    const graph = await Deliveries.list( this.getOptions() );
    if ( !graph ) {
      return; // Bail if we run into an authorization problem.
    }

    const weave = await Weave.make( graph );

    // Almost done. Place results into outer interface and ready next cycle.
    const feed = [];
    for ( const id of weave.feed ) {
      feed.push( weave.deliveries[id] );
    }
    this.queue.push( ...feed );
    this.head = this.queue[0]?.created;
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

  // Fetch the next highest delivery.
  async next () {
    await this.checkQueue()
    const delivery = this.queue.shift();
    this.head = this.queue[0]?.created;
    if ( delivery == null ) {
      return null; // protection, but we should generally not get here.
    } else {
      const key = `${ delivery.id }`;
      return { delivery, key };
    }
  }
}




class Feed {
  constructor ({ readers }) {
    this.readers = readers;
  }

  // This is overkill for a single threaded graph resource, but it's possible
  // that the representations of these delivery/publishing resources will
  // take on some sort of higher-dimensional form in the future.
  static async make () {
    const readers = [
      await Reader.make()
    ];

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

  // Fetch the next highest scoring delivery from the reader with the highest head.
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
  Feed
}