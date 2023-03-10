import { goto } from "$app/navigation";
import { browser } from "$app/environment";
import { getAccount } from "$lib/helpers/account.js";
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
    
    } catch ( error ) {
      // TODO: We need an error page here for internal authentication errors.
      console.error( error );
      return goto( "/" );
    }
  }
}