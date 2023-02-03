import { writable } from "svelte/store";

const createPreview = function () {
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


export const preview = createPreview();
