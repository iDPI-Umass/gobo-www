import { writable } from "svelte/store";

const createStore = function () {
  let event = null;

  const { subscribe, update } = writable( event );

  return {
    subscribe,
    put: ( value ) => {
      update(() => value );
    },
  };
};


const draftStores = {
  content: createStore(),
  identities: createStore(),
  attachments: createStore(),
  reply: createStore(),
  quote: createStore(),
  options: createStore(),
  alerts: createStore(),
};

export { draftStores }