import { writable } from "svelte/store";


const createStore = function () {
  let event = {};

  const { subscribe, update } = writable( event );

  return {
    subscribe,
    put: ( value ) => {
      update(() => value );
    },
    update: ( data ) => console.warn("deprecated draft update", data),
    clear: () => console.warn("deprecated draft clear"),
  };
};

const draftStore = createStore();

const draftStores = {
  content: createStore(),
  identities: createStore(),
  reply: createStore(),
  quote: createStore(),
  options: createStore(),
};

export { draftStore, draftStores }