import * as Time from "@dashkite/joy/time";
import * as Talos from "@dashkite/talos";
import * as Count from "$lib/resources/notification-count.js";


const When = {
  listen: function ( talos, event ) {
    return event === "listen";
  },
  stop: function ( talos, event ) {
    return event === "stop";
  },
  fetch: function ( talos, event ) {
    return event === "fetch";
  }
};


const Poll = {
  // interval: 300000, // 5 minutes
  interval: 30000,
  count: 0,
  id: null,

  fetch: async function () {
    const result = await Count.get();
    Poll.count = result.count;
  },

  clear: async function () {
    await Count.put( 0 );
    Poll.count = 0;
  },


  sourceArray: [],
  source: async function* () {
    while ( true ) {
      await Time.sleep(1000);
      while ( Poll.sourceArray.length > 0 ) {
        const event = Poll.sourceArray.shift();
        // console.log({ event });
        yield event
      }
    }
  },
  event: function ( event ) {
    Poll.sourceArray.push( event );
  },
};


const machine = Talos.Machine.make( "notification polling", {
  start: "listen",
  listen: {
    fetch: {
      when: When.fetch,
      run: Poll.fetch,
      move: "listen"
    },
    stop: When.stop,
    default: "listen"
  },
  stop: {
    listen: When.listen,
    default: "stop"
  }
});

Poll.reactor = Talos.Async.start( machine, Poll.source() );


// Setup events

// Regular interval events
(async function () {
  while ( true ) {
    await Time.sleep( Poll.interval );
    Poll.event( "fetch" );
  }
})();

// Visibility events
document.addEventListener( "visibilitychange", function() {
  if ( document.hidden ) {
    Poll.event( "stop" );
  } else {
    Poll.event( "listen" );
  }
});



// Export the Poll interface so we can pipe the count value around with Svelte.
export { Poll }