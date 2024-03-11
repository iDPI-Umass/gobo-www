import * as Time from "@dashkite/joy/time";
import * as It from "@dashkite/joy/iterable";
import * as Talos from "@dashkite/talos";
import * as Count from "$lib/resources/notification-count.js";


const Poll = {
  state: "listen",
  interval: 300000, // 5 minutes
  // interval: 30000, // 30 seconds debug
  count: 0,

  fetch: async () => {
    console.log("fetching notification count...")
    const result = await Count.get();
    Poll.count = result.count;
  },
  clear: async () => {
    await Count.put( 0 );
    Poll.count = 0;
  }
};


// Gather events into a queue...
const Events = {};

Events.queue = It.Queue.create();
Events.push = ( event ) => Events.queue.enqueue( event );
Events.wait = () => Events.queue.dequeue();

// Fetch the notification count at regular intervals.
(async () => {
  while ( true ) {
    await Time.sleep( Poll.interval );
    Events.push({ name: "fetch" });
  }
})();

// Watch for visibility events from the document.
document.addEventListener( "visibilitychange", () => {
  if ( document.hidden ) {
    Events.push({ name: "wait" });
  } else {
    Events.push({ name: "listen" });
  }
});

// Expose event queue as a reactor that a Talos state machine can pull on.
// Completes conversion of push-based events into pull-based reactor.
Events.buildReactor = async function* () {
  while ( true ) {
    yield await Events.wait();
  }
}


const When = {
  fetch: ( talos, event ) => event.name === "fetch",
  wait: ( talos, event ) => event.name === "wait",
  listen: ( talos, event ) => event.name === "listen" 
};


const machine = Talos.Machine.make( "notification polling", {
  start: "listen",
  listen: {
    fetch: {
      when: When.fetch,
      run: Poll.fetch,
      move: "listen"
    },
    wait: When.wait,
    default: "listen"
  },
  wait: {
    listen: When.listen,
    default: "wait"
  }
});


// Setup talos run instance.
Poll.reactor = Talos.Async.start( machine, Events.buildReactor() );

// Setup interface to accept incoming events.
Poll.event = ( event ) => Events.push( event );

// Export the Poll interface so we can pipe the count value around with Svelte.
export { Poll }