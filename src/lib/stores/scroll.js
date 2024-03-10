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


const feed = createStore();
const notifications = createStore();

export { 
  feed,
  notifications,
}