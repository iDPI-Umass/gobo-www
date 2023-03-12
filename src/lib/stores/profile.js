import { writable } from "svelte/store";
import { browser } from "$app/environment";
import * as LS from "$lib/helpers/local-storage.js";

const createStore = function () {
  let profile;

  if ( browser ) {
    profile = LS.read( "gobo-profile" );
  }

  if ( profile == null ) {
    profile = {};
  }
  
  const { subscribe, update } = writable( profile );

  return {
    subscribe,
    setProfile: function ( data ) {
      LS.write( "gobo-profile", data );
      update( function () {
        return data;
      });
    },
    updateProfile: function ( data ) {
      update( function ( profile ) {
        Object.assign( profile, data );
        LS.write( "gobo-profile", profile );
        return profile;
      });
    },
    logout: function () {
      LS.remove( "gobo-profile" );
      update( function () {
        return {};
      });
    }
  };
};


export const profileStore = createStore();
