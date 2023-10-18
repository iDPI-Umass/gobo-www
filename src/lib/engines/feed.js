import { Feed } from "$lib/resources/feed.js";
import { IdentityEngine } from "$lib/engines/identities.js";
import { FilterEngine } from "$lib/engines/filters.js";


/***
While the classes within "$lib/resources/feed" are focused on a more formal
composition of HTTP feed resources, the classes below are a more tactical
composition of application resources, a layer between the Svelte application
interfaces and with the feed composite.

Some of the awkwardness comes from the fact that, for now, we are focused on
providing a reverse-chronological feeds coming off identities. 
Soon, we'll need further generalization in this layer to handle configuration
of interfaces that draw on feeds coming off lens calculations.

What's interesting is there is an emerging need for a singleton interface to
model the abstract feed engine. We need a singleton to enforce state consensus
as we read and edit identities here and throughout the application. That means
It's coming from the lack of a proper caching layer in the browser. So, this
works for now, but the singleton interface is bespoke and brittle. I imagine 
a lot of it would evaporate if we had a general write-thru cache like DashKite
created for application clients.

Something else important: We've been having issues with consensus of posts in
the feed because, even with a singleton interface, we have an asynchronous flow
that we'd like to interrupt in reaction to toggled identity filters. In that case,
we want to avoid wasteful HTTP requests and discard this instance in favor of
a new empty one. I'm handling that with a flag for right now, but that's
a strong indication that this would be more clearly expressed as a state machine.
***/

class FeedEngine {
  constructor ({ feed, identityEngine, filterEngine }) {
    this.feed = feed;
    this.identityEngine = identityEngine;
    this.filterEngine = filterEngine;
    this.replies = new Set();
    this.nextPosts = [];
  }

  static async create () {
    const identityEngine = await IdentityEngine.create();
    const filterEngine = await FilterEngine.create();
    const identities = identityEngine.getActiveIdentities();
    const filters = filterEngine.getActiveFilters();
    const feed = await Feed.create({ identities, filters });
    return new FeedEngine({ feed, identityEngine, filterEngine });
  }

  async reset () {
    this.isStopped = true;
    const identityEngine = this.identityEngine;
    const filterEngine = this.filterEngine;
    const identities = identityEngine.getActiveIdentities();
    const filters = filterEngine.getActiveFilters();
    const feed = await Feed.create({ identities, filters });
    return new FeedEngine({ feed, identityEngine, filterEngine });
  }

  async pull ( count ) {
    const results = [];

    for ( let i = 0; i < count - 1; i++ ) {      
      if ( this.isStopped === true ) {
        return [];
      }

      const result = await this.feed.next();
      if ( result != null ) {
        const { post } = result;
        // Skip posts that start reply chains that we've already seen.
        if ( this.replies.has(post.id) && post.reply == null ) {
          continue;
        }

        if ( post.reply != null ) {
          this.replies.add( post.reply );
        }

        results.push( result );
      
      } else {
        // We're at the bottom of the feed.
        // TODO: This would be different for non time-based feed sorting.
        break;
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

  getFilters () {
    return this.filterEngine.filters;
  }
}


export {
  FeedEngine
}