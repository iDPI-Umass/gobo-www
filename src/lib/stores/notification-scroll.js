import { writable } from "svelte/store";

const createStore = function () {
  let event = {};

  const { subscribe, update } = writable( event );

  return {
    subscribe,
    push: function ( value ) {
      if ( value == null ) {
        return;
      }
      update( function () {
        return value;
      });
    }
  };
};


export const scrollStore = createStore();
