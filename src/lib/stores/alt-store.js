import { writable } from "svelte/store";

const createStore = function () {
  let data = {};

  const { subscribe, update } = writable( data );
  
  return {
    subscribe,
    set: function ( data ) {
      update( function () {
        return data;
      });
    }
  };
};


export const altStore = createStore();
