import { goto } from "$app/navigation";
import { App } from "$lib/engines/account.js";


export async function guard() {
  try {
    if ( (await App.isLoggedOut()) ) {
      return goto( "/" );
    }

    if ( !(await App.isAllowedAccess() )) {
      return goto( "/permissions" );
    }

  } catch ( error ) {
    // TODO: We to spec out what we'd like to happen here. This logs the person
    //   out so they can be sent to the public homepage and safely reset their space.
    console.error( error );
    return await App.logout();
  }
}