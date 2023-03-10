import { goto } from "$app/navigation";
import { browser } from "$app/environment";
import * as Account from "$lib/helpers/account.js";
import { getAuth0Client } from "$lib/helpers/auth0.js";

const exists = function ( value ) {
  return value != null;
};

// The searchParams instance has some nuance for querystrings that we don't need.
// Convert to plain object to make the individual handlers easier to write.
const extractQuery = function ( url ) {
  const output = {};
  for ( const entry of url.searchParams.entries() ) {
    output[ entry[0] ] = entry[1];
  }
  return output;
};

const determinePlatform = function ( query ) {
  if ( exists(query.oauth_token) ) {
    return "twitter.com";
  }

  if ( exits(query.state) ) {
    return "www.reddit.com";
  }
  
  if ( exists(query.code) ) {
    return "mastodon.social";
  }

  return undefined;
};

// TODO: We need a landing page to direct people when there is callback problem.
const handleCallbackError = async function () {
  goto( "/callback-error" );
};


const handleAuthCallback = async function ( query ) {
  console.log( "Starting primary authentication callback", query );
  const { state, code, error } = query;

  if ( Account.isLoggedOut() === true ) {
    try {
      // Establishing the client is asynchronous, await the possible promise here.
      const client = await getAuth0Client();

      if ( exists(state) && ( exists(code) || exists(error) )) {
        await client.handleRedirectCallback();
        return goto( "/home" );
      } else {
        console.log( "auth callback lacks expected credentials", query );
        return await handleCallbackError();
      }
    } catch ( error ) {
      console.error( error );
      return await handleCallbackError();
    }
  } else {
    // Passthrough for now. Happens if client back buttons to callback.
    console.log( "auth credentials already loaded" );
    return goto( "/home" );
  }
};

// 
const handleAddIdentityCallback = async function ( query ) {
  console.log( "Starting add identity callback", query );

  const base_url = LS.read( "gobo-base_url" );
  
  if ( base_url != null ) {
    const client = await Account.getGOBOClient();
    await client.addIdentityCallback({
      parameters: {
        base_url: base_url,
        oauth_token: query.oauth_token,
        oauth_verifier: query.oauth_verifier,
        code: query.code,
        state: query.state
      }
    });
    return goto( "/identities/list" );
  } else {
    // We hold onto the base_url in local storage before redirecting. If it's
    // not here, we passthrough to avoid a duplicate POST that's not idempotent.
    return goto( "/identities/list" );
  }
};



// Figure out what type of callback we're dealing with.
const handleCallbacks = async function () {
  if ( !browser ) {
    return null;
  }

  try {
    const url = new URL( document.location );
    const query = extractQuery( url );
    
    switch ( url.pathname ) {
      case "/auth-callback":
        // Callback from Auth0, primary application authentication
        await handleAuthCallback( query );
        break;
      case "/add-identity-callback":
        // Identity authentication from Mastodon, Reddit, and Twitter
        await handleAddIdentityCallback( query );
        break;
      default:
        // Non-callback passthrough
        return null;        
    }
  } catch ( error ) {
    console.error( error );
    await handleCallbackError();
  }
};

export { handleCallbacks }