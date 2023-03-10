import { writable } from "svelte/store";
import { browser } from "$app/environment";
import * as LS from "$lib/stores/local-storage.js";


const createStore = function () {
  let config;

  if ( browser ) {
    config = LS.read( "gobo-config" );

    if ( config == null ) {
      config = {
        defaultFeedSort: "chronological-descending",
        displayEngagement: false 
      };
      LS.write( "gobo-config", config );
    }

  } else {
    config = {
      defaultFeedSort: "chronological-descending",
      displayEngagement: false
    };
  }
  
  const { subscribe, update } = writable( config );

  return {
    subscribe,
    setDefaultFeedSort: function ( value ) {
      update( function ( config ) {
        config.defaultFeedSort = value;
        LS.write( "gobo-config", config );
        return config;
      });
    },
    setDisplayEngagement: function ( value ) {
      config.displayEngagement = value;
      LS.write( "gobo-config", config );
      return config;
    }
  };
};


export const feedStore = createStore();
