import { Feed as Weaver } from "$lib/resources/person-identity-feeds/notifications.js";
import * as stores from "$lib/stores/notification.js";
import { Poll } from "$lib/polling/notifications.js";
import { Cache } from "$lib/resources/cache.js";
import * as Account from "$lib/helpers/account.js";


// Notifications have similar needs to the main post feed, so we use similar
// patterns. See lib/engines/feed.js for more background.

let singletonFeed;

const Feed = {};

Feed.make = async ( context = {} ) => {
  const view = context.view ?? "all";

  return {
    notifications: [],
    scroll: 0,
    view: view,
    weaver: await Weaver.make({ view }),
    isStopped: false,
    count: 0,
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

Feed.clear = async ({ view }) => {
  // Halt feed weaver pulling before discarding old object.
  Feed.halt();
  singletonFeed = Feed.make({ view });
  await singletonFeed
};

Feed.refresh = async ( context = {} ) => {
  const view = context.view ?? "all";
  await Feed.clear({ view });
  Feed.command( "refresh" );
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


const Notification = {};
Notification.source = ( notification ) => {
  const source = Cache.getSource( notification.source_id );
  if ( source == null ) {
    console.error(`engine notification: unable to fetch source ${ notification.source_id }`);
  }
  return source;
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
Poll.event({ name: "start" });
Poll.event({ name: "fetch" });


// Special instantiation, when logged in, to pull data and send to listeners.
// This cuts down on requests to the API, manages race conditions, and helps
// mitigate what appear to be service worker effects on the singleton.
(async () => {
  if ( (await Account.isLoggedIn()) === true ) {
    await Feed.refresh();
  }
})();


export {
  Feed,
  Notifications,
  Notification,
  Position,
  Count
}