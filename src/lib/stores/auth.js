import { writable } from "svelte/store";
import { browser } from "$app/environment";
import * as LS from "$lib/stores/local-storage.js";
import { getClient } from "$lib/helpers/auth0.js";


const createAuth = function () {
  let auth;

  if ( browser ) {
    auth = LS.read( "gobo-auth" );
    if ( auth == null ) {
      auth = {};
    }
    auth.client = getClient();
  } else {
    auth = {};
  }
  
  const { subscribe, update } = writable( auth );

  return {
    subscribe,
    update: function ( data ) {
      update( function ( auth ) {
        Object.assign( auth, data );
        LS.write( "gobo-auth", auth );
        return auth;
      });
    },
    logout: function () {
      update( function ( auth ) {
        auth = {};
        LS.write( "gobo-auth", auth );
        return auth;
      });
    }
  };
};


export const auth = createAuth();
