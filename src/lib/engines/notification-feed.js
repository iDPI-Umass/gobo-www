import { Feed } from "$lib/resources/person-identity-feeds/notifications.js";
import * as PostFeedSingleton from "$lib/engines/feed-singleton.js";

/***
This is not a stable interface, but until we isolate the identities into their
own singleton pattern, we need to draw from the main feed singleton's authority.

It's pretty clear we need a Helium-styled registry.
***/

class FeedEngine {
  constructor ({ feed, identityEngine }) {
    this.feed = feed;
    this.identityEngine = identityEngine;
  }

  static async create ({ view }) {
    const inner = await PostFeedSingleton.getEngine();
    const identityEngine = inner.identityEngine;
    const identities = identityEngine.getActiveIdentities();
    const feed = await Feed.create({ identities, view });
    return new FeedEngine({ feed, identityEngine });
  }

  async reset ({ view }) {
    this.isStopped = true;
    const inner = await PostFeedSingleton.getEngine();
    const identityEngine = inner.identityEngine;
    const identities = identityEngine.getActiveIdentities();
    const feed = await Feed.create({ identities, view });
    return new FeedEngine({ feed, identityEngine });
  }

  async pull ( count ) {
    const results = [];
    let current = 0;

    while ( current < count ) {
      if ( this.isStopped === true ) {
        return [];
      }

      const result = await this.feed.next();
      if ( result == null ) {
        // We're at the bottom of the feed.
        // TODO: This would be different for non time-based feed sorting.
        break;
      
      } else {
        results.push( result );
        current++;
      }
    }
   
    if ( this.isStopped === true ) {
      return [];
    }
    
    return results;
  }

  getIdentities () {
    return this.identityEngine.identities;
  }

  getActiveIdentities () {
    return this.identityEngine.getActiveIdentities();
  }

  setActiveState ( identity, active ) {
    this.identityEngine.setActiveState( identity, active );
  }
}


export {
  FeedEngine
}