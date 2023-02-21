import { goto } from "$app/navigation";
import { browser } from "$app/environment";
import { auth } from "$lib/stores/auth.js";
import { get } from "svelte/store";

const exists = function ( value ) {
  return value != null;
};


export async function handleAuthCallback () {
  if ( browser ) {
    let params = ( new URL( document.location )).searchParams;
    let state = params.get( "state" );
    let code = params.get( "code" );
    let error = params.get( "error" );
    let data = get( auth );

    if ( data.loggedIn !== true ) {
      try {
        const client = await data.client;

        if ( exists(state) && ( exists(code) || exists(error) )) {
          auth.update({ state, code, error, loggedIn: true });
          await client.handleRedirectCallback();
          return goto( "/home" );
        }        
      } catch ( error ) {
        console.error( error );
        return goto( "/" );
      }

      console.log("no credentials found yet");
      return goto( "/" );

    } else {
      if ( exists(state) && ( exists(code) || exists(error) )) {
        console.log( "refreshing credentials" );
        auth.update({ state, code, error, loggedIn: true });
        await client.handleRedirectCallback();
        return goto( "/home" );
      }

      // Passthrough
      console.log("auth credentials already loaded");
    }
  }

  return {};
};