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


const singleton = createStore();
const command = createStore();
const count = createStore();

export { 
  singleton,
  command,
  count
}