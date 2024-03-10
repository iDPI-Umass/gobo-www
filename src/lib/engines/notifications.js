import { Feed as Weaver } from "$lib/resources/person-identity-feeds/notifications.js";
import * as stores from "$lib/stores/notifications.js";
import { Poll, Events as PollEvents } from "$lib/polling/notifications.js";


// Notifications have similar needs to the main post feed, so we use similar
// patterns. See lib/engines/feed.js for more background.

let singletonFeed;

const Feed = {};

Feed.make = async () => {
  return {
    notifications: [],
    scroll: 0,
    weaver: await Weaver.make(),
    isStopped: false,
    count: 0,
  };
};

Feed.write = () => {
  singletonFeed;
};

Feed.read = async () => {
  if ( singletonFeed == null ) {
    singletonFeed = await Feed.make();
  }
  return singletonFeed;
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

Feed.halt = () => {
  if ( singletonFeed != null ) {
    singletonFeed.isStopped = true;
  }
};

Feed.clear = async () => {
  // Halt feed weaver pulling before discarding old object.
  Feed.halt();
  singletonFeed = await Feed.make();
};

Feed.refresh = async ({ count } = {}) => {
  Feed.command( "refresh" );
  await Feed.clear();
  await Feed.pull( count ?? 25 );
  Feed.command( "ready" );
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
      results.push( result );
      current++;
    }
  }
 
  if ( Feed.isStopped === true ) {
    return;
  }
  
  await Notifications.push( results );
};


const Notifications = {};

Notifications.read = async () => {
  const feed = await Feed.read();
  return feed.notifications;
};

Notifications.update = async ( notifications ) => {
  const feed = await Feed.read();
  feed.notifications = notifications;
  Feed.update();
};

Notifications.push = async ( notifications ) => {
  const feed = await Feed.read();
  feed.notifications.push( ...notifications );
  Feed.update();
};


const Position = {};

Position.read = async () => {
  const feed = await Feed.read();
  return feed.position;
};

Position.write = async ( position ) => {
  const feed = await Feed.read();
  feed.position = position;
};




const Count = {};

Count.read = async () => {
  const feed = await Feed.read();
  return feed.count;
};

Count.write = async ( count ) => {
  const feed = await Feed.read();
  feed.count = count;
};


Count.pulse = async () => {
  const feed = await Feed.read();
  if ( feed.count !== Poll.count ) {
    feed.count = Poll.count;
    stores.count.put({ count: feed.count });
  }
};

Count.clear = async () => {
  const feed = await Feed.read();
  if ( Poll.count !== 0 ) {
    await Poll.clear();
    feed.count = 0;
    stores.count.put({ count: 0 });
  }
};

// Pulls on the Polling state machine reactor.
(async () => {
  for await ( const talos of Poll.reactor ) {
    if ( talos.failure ) {
      console.error( talos.error );
      return;
    }
    Count.pulse();
  }
});

// Feed Polling state machine initial events to get started.
PollEvents.push({ name: "start" });
PollEvents.push({ name: "fetch" });


export {
  Feed,
  Notifications,
  Position,
}