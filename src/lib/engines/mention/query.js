import * as It from "@dashkite/joy/iterable";
import * as Talos from "@dashkite/talos";


const When = {};
When.wait = ( talos, event ) => event.name === "wait";
When.listen = ( talos, event ) => event.name === "listen";
When.query = ( talos, event ) => event.name === "query";


const Run = {};

Run.make = ( talos, event ) => {
  talos.context.element = event.element;
};

Run.emit = async ( talos, event ) => {
  const { element } = talos.context;
  const { query, promise } = event;
  const incoming = new CustomEvent( "gobo-mention-suggestions-incoming", { 
    detail: { query }
  });
  element.dispatchEvent( incoming );
  
  const suggestions = await promise;
  const payload = new CustomEvent( "gobo-mention-suggestions", { 
    detail: { query, suggestions }
  });
  element.dispatchEvent( payload );
};


const machine = Talos.Machine.make( "mention query", {
  start: {
    run: Run.make,
    move: "wait"
  },
  listen: {
    emit: {
      when: When.query,
      run: Run.emit,
      move: "listen",
    },
    wait: When.wait,
    default: "listen"
  },
  wait: {
    listen: When.listen,
    default: "wait"
  }
});



const Query = {};

Query.make = ({ element }) => {
  const queue = It.Queue.create();
  const push = ( event ) => queue.enqueue( event );
  const wait = () => queue.dequeue();
  const buildReactor = async function* () {
    while ( true ) {
      const event = await wait();
      if ( event.name === "halt" ) {
        return;
      }
      yield event; 
    }
  };

  const reactor = Talos.Async.start( machine, buildReactor() );
  const pull = async () => {
    for await ( const talos of reactor) {
      if ( talos.failure ) {
        console.error( talos.error );
        return;
      }
    }
  };

  // Prepare a handle the caller can keep in scope for as long as it needs.
  const handle = {
    reactor,
    runner: pull(),
    push,
    listen: () => push({ name: "listen" }),
    wait: () => push({ name: "wait" }),
    query: ( query, promise ) => push({ name: "query", query, promise }),
    halt: () => push({ name: "halt" }),
  };
  
  // Start off the state machine and return the prepared handle.
  handle.push({ name: "start", element });
  return handle;
};


export {
  Query
}