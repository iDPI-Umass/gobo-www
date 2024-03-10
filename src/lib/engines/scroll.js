import * as It from "@dashkite/joy/iterable";
import * as Talos from "@dashkite/talos";

/*
Accept scroll events from the DOM and convert them into an event target that
signals when additional resources should be added to the bottom of the
scrollable element. 

This is written to be resuable across needed contexts. As of this writing,
those are the post and notificaiton feeds. But this formulation is flexible
enough to describe the infinite scrolling HX pattern generally within
Web browsers.
*/

const When = {};
When.wait = ( talos, event ) => event.name === "wait";
When.listen = ( talos, event ) => event.name === "listen";

When.scroll = ( talos, event ) => event.name === "scroll";
When.downward = ( talos, event ) => event?.deltaY <= 0;

When.nearBottom = ( talos, event ) => {
  if ( !When.scroll( talos, event )) {
    return false;
  }
  if ( !When.downward( talos, event )) {
    return false;
  }

  const { element } = talos.context;
  const current = element.scrollHeight - element.scrollTop;
  return current < 3 * element.offsetHeight;
};


const Run = {};

Run.make = ( talos, event ) => {
  talos.context.element = event.element;
};

Run.emit = ( talos ) => {
  const { element } = talos.context;
  const detail = { marker: element.scrollHeight };
  const event = new CustomEvent( "gobo-infinite-scroll", { detail });
  element.dispatchEvent( event );
};


const machine = Talos.Machine.make( "infinite scroll", {
  start: {
    run: Run.make,
    move: "wait"
  },
  listen: {
    emit: {
      when: When.nearBottom,
      run: Run.emit,
      move: "wait",
    },
    wait: When.wait,
    default: "listen"
  },
  wait: {
    listen: When.listen,
    default: "wait"
  }
});



// We can rely on Scroll.make's closure, along with the Talos context to
// provide reuse without needing to go all the way to formal classes.
const Scroll = {};

Scroll.make = ({ element }) => {
  // Setup the queue that will map incoming events into a reactor talos can consume.
  const queue = It.Queue.create();
  const push = ( event ) => queue.enqueue( event );
  const wait = async ( event ) => await queue.dequeue( event );
  const buildReactor = async function* () {
    while ( true ) {
      const event = await wait();
      if ( event.name === "halt" ) {
        return;
      }
      yield event; 
    }
  };

  const reactor = Talos.Async.start( machine, buildReactor() )

  // Prepare a handle the caller can keep in scope for as long as it needs.
  const handle = {
    reactor,
    push,
    listen: () => push({ name: "listen "}),
    wait: () => push({ name: "wait" }),
    event: ( event ) => push({ name: "scroll", event }),
    halt: () => push({ name: "halt" }),
  };
  
  // Start off the state machine and return the prepared handle.
  handle.push({ name: "start", element });
  return handle;
};


export {
  Scroll
}