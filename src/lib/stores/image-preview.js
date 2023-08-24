import { writable } from "svelte/store";

const createStore = function () {
  let attachment = {};

  const { subscribe, update } = writable( attachment );
  
  return {
    subscribe,
    set: function ( attachment ) {
      update( function () {
        return attachment;
      });
    }
  };
};


export const previewStore = createStore();
