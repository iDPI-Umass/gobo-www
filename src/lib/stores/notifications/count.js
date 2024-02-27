import { writable } from "svelte/store";
import { Poll, Events } from "$lib/polling/notifications.js";

const createStore = function () {
  let event = { count: 0 };
  let current = 0;

  const { subscribe, update } = writable( event );
  const store = { subscribe };
  
  store.push = ( value ) => {
    update( () => value );
  };

  store.broadcast = () => {
    const { count } = Poll;
    if ( count !== current ) {
      current = count;
      store.push({ count });
    }
  };

  store.clear = async () => {
    await Poll.clear();
    store.broadcast();
  };

  // Pulls on the Polling state machine reactor.
  store.go = async function () {
    for await ( const talos of Poll.reactor ) {
      if ( talos.failure ) {
        console.error( talos.error );
        return;
      }
      countStore.broadcast();
    }
  };

  return store;
};



// Start pulling on the polling reactor and feed it initial events to get started.
const countStore = createStore();
countStore.go();
Events.push({ name: "listen" });
Events.push({ name: "fetch" });

export { countStore }