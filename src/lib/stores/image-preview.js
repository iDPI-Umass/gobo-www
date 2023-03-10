import { writable } from "svelte/store";

const createStore = function () {
  let file = {};

  const { subscribe, update } = writable( file );
  
  return {
    subscribe,
    set: function ( file ) {
      update( function () {
        return file;
      });
    }
  };
};


export const previewStore = createStore();
