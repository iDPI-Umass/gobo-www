import { Feed as Weaver } from "$lib/resources/person-identity-feeds/posts.js";
import * as stores from "$lib/stores/feed.js";
import { App } from "$lib/engines/account.js";


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


// Careful about the engine state here. We want to enforce a singleton interface.
// But we have asynchronous instantiation behavior. Assign promise before falling
// through to resolving the promise.

let singletonFeed;

const Feed = {};

Feed.make = async () => {
  return {
    posts: [],
    weaver: await Weaver.make(),
    isStopped: false,
    replies: new Set(),
  };
};

Feed.write = () => {
  singletonFeed;
};

Feed.read = async () => {
  if ( singletonFeed == null ) {
    singletonFeed = Feed.make();
  }
  return singletonFeed = await singletonFeed;
};

Feed.put = () => {
  stores.singleton.put( singletonFeed );
};

Feed.command = ( name ) => {
  stores.command.put({ name });
};

Feed.update = () => {
  Feed.write();
  Feed.put();
};

Feed.load = async () => {
  await Feed.read();
  Feed.update();
};

Feed.halt = () => {
  if ( singletonFeed != null ) {
    singletonFeed.isStopped = true;
  }
};

Feed.clear = async () => {
  // Halt feed weaver pulling before discarding old object.
  Feed.halt();
  singletonFeed = Feed.make();
  singletonFeed = await singletonFeed;
};

Feed.refresh = async () => {
  await Feed.clear();
  Feed.command( "refresh" );
};

Feed.hide = async () => {
  Feed.command( "hide" );
};

Feed.show = async () => {
  Feed.command( "show" );
};


Feed.next = async () => {
  const feed = await Feed.read();
  return await feed.weaver.next();
};

Feed.pull = async ( count ) => {
  const results = [];
  let current = 0;

  while ( current < count ) {
    if ( Feed.isStopped === true ) {
      return;
    }

    const result = await Feed.next();
    if ( result == null ) {
      // We're at the bottom of the feed.
      // TODO: Responding to this condition would be different for non-time-based feed sorting.
      break;
    
    } else {
      const { post } = result;
      // Skip posts that start reply chains that we've already seen.
      if ( await Reply.has( post.id )) {
        continue;
      }

      for ( const id of post.threads ?? [] ) {
        await Reply.add( id );
      }

      results.push( result );
      current++;
    }
  }
 
  if ( Feed.isStopped === true ) {
    return;
  }
  
  await Posts.push( results );
};


const Posts = {};

Posts.read = async () => {
  const feed = await Feed.read();
  return feed.posts;
};

Posts.update = async ( posts ) => {
  const feed = await Feed.read();
  feed.posts = posts;
  Feed.update();
};

Posts.push = async ( posts ) => {
  const feed = await Feed.read();
  feed.posts.push( ...posts );
  Feed.update();
};



const Reply = {};

Reply.has = async ( id ) => {
  const feed = await Feed.read();
  return feed.replies.has( id ); 
};

Reply.add = async ( id ) => {
  const feed = await Feed.read();
  feed.replies.add( id );
};




// Special instantiation, when logged in, to pull data and send to listeners.
// This cuts down on requests to the API and manages race conditions.
Feed.startup = async () => {
  if ( (await App.isAllowedAccess()) ) {
    await Feed.refresh();
  }
};

App.register( Feed.startup );


export {
  Feed,
  Posts,
  Reply,
}