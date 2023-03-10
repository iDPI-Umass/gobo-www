import { writable } from "svelte/store";

const createStore = function () {
  let marker = { position: 0 };

  const { subscribe, update } = writable( marker );

  return {
    subscribe,
    reset: function () {
      update( function ( marker ) {
        marker.position = 0;
        return marker;
      });
    }
  };
};


export const markerStore = createStore();
