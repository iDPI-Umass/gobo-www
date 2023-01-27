import { writable } from "svelte/store";

const createMarker = function () {
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


export const marker = createMarker();
