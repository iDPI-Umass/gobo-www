import { writable } from "svelte/store";
import { Poll } from "$lib/polling/notifications.js";

const createStore = function () {
  let event = { count: 0 };
  let current = 0;

  const { subscribe, update } = writable( event );

  const store = { subscribe };
  
  store.push = function ( value ) {
    update( function () {
      return value;
    });
  };

  store.broadcast = function () {
    const { count } = Poll;
    if ( count !== current ) {
      current = count;
      store.push({ count });
    }
  };

  store.clear = async function () {
    await Poll.clear();
    store.broadcast();
  };

  return store;
};

const countStore = createStore();


// Pull on the Polling state machine reactor.
const go = async function () {
  for await ( const talos of Poll.reactor ) {
    // Read the current count and broadcast to rest of application.
    countStore.broadcast();
    
    // TODO: Error handling could be more resilient, but just stop for now.
    // console.log( "notification polling", talos.state );
    if ( talos.failure ) {
      console.error( talos.error );
      return;
    }
  }
};

// Start pulling on the polling reactor and feed it initial events to get started.
go();
Poll.event("listen");
Poll.event("fetch");


export { countStore }