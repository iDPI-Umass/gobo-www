import { goto } from "$app/navigation";
import { browser } from "$app/environment";
import { getAccount, getProfile, logout } from "$lib/helpers/account.js";
import { getAuth0Client } from "$lib/helpers/auth0.js";


export async function guard() {
  if ( browser ) {
    try {
      const client = await getAuth0Client();
      if ( await client.isAuthenticated() !== true ) {
        return goto( "/" );
      }

      const account = await getAccount();
      if ( !account.permissions.has("general") ) {
        return goto( "/permissions" );
      }

      // Ensure that our access token is still valid.
      await getProfile();
    
    } catch ( error ) {
      // TODO: We to spec out what we'd like to happen here. This logs the person
      //   out so they can be sent to the public homepage and safely reset their space.
      console.error( error );
      return await logout();
    }
  }
}