import { goto } from "$app/navigation";
import { browser } from "$app/environment";
import * as LS from  "$lib/helpers/local-storage.js";
import * as Account from "$lib/helpers/account.js";
import * as Welcome from "$lib/helpers/welcome.js";
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

// TODO: We need a landing page to direct people when there is callback problem.
const handleCallbackError = async function () {
  goto( "/callback-error" );
};


const toAuthenticationPage = async function () {
  const client = await getAuth0Client();
  await client.loginWithRedirect()
};


// TODO: We need to be careful this doesn't create a routing infinite loop with
//   the guard redirect functionality.
const handleRootRedirect = async function () {
  const client = await getAuth0Client();
  if ( await client.isAuthenticated() !== true ) {
    // We can stop here. Send to login page.
    // await toAuthenticationPage();
  } else {
    const account = await Account.getAccount();
    if ( account.permissions.has("general") ) {
      // This person is allowed access to application features. Redirect them home.
      return goto( "/home" );
    }
  
    // No further checks. Send to login page.
    await toAuthenticationPage();
  }
}

const successfulAuth = async function () {
  const account = await Account.getAccount();
  if ( !account.permissions.has("general") ) {
    return goto( "/permissions" );
  }
  const welcome = await Welcome.get();
  if ( welcome == null ) {
    return goto("/welcome");
  } else {
    return goto("/home");
  }
}

const handleAuthCallback = async function ( query ) {
  console.log( "Starting primary authentication callback", query );
  const { state, code, error } = query;

  if ( Account.isLoggedOut() === true ) {
    try {
      // Establishing the client is asynchronous, await the possible promise here.
      const client = await getAuth0Client();

      if ( exists(state) && ( exists(code) || exists(error) )) {
        await client.handleRedirectCallback();
        return await successfulAuth();
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
    return await successfulAuth();
  }
};

// Handles callbacks from third-party platforms. We need to hold onto the 
const handleAddIdentityCallback = async function ( query ) {
  console.log( "Starting add identity callback", query );
  // console.log({
  //   base_url: baseURL,
  //   oauth_token: query.oauth_token,
  //   oauth_verifier: query.oauth_verifier,
  //   code: query.code,
  //   state: query.state
  // });
  // return goto( "/identities" );

  // We hold onto the base_url in local storage before redirecting. We need to
  // provide this information to GOBO, but POST aren't idempotent, so we need to
  // be careful about only applying this once.
  const platform = LS.read( "gobo-platform" );
  const baseURL = LS.read( "gobo-baseURL" );
  LS.remove( "gobo-baseURL" );
  if ( baseURL == null ) {
     // Passthrough if we've marked the base_url as missing.
     return goto( "/identities" );
  }
  
  const client = await Account.getGOBOClient();
  const login = LS.read( "gobo-bluesky-login" );
  const secret = LS.read( "gobo-bluesky-secret" );
  LS.remove(  "gobo-bluesky-login" );
  LS.remove( "gobo-bluesky-secret" );

  try {
    await client.actionOnboardIdentityCallback.post({ content: {
      platform,
      base_url: baseURL,
      oauth_token: query.oauth_token ?? undefined,
      oauth_verifier: query.oauth_verifier ?? undefined,
      code: query.code ?? undefined,
      state: query.state ?? undefined,
      bluesky_login: login ?? undefined,
      bluesky_secret: secret ?? undefined
    }});
    LS.write("fetching", true);
    return goto( "/identities" );
  }
  catch (error) {
    console.error(error);
    return goto( "/identities/add?failure=true" );
  }
};



// Detect and handle any redirect or callback.
const handleRedirect = async function () {
  if ( !browser ) {
    return null;
  }

  try {
    const url = new URL( document.location );
    const query = extractQuery( url );
    
    switch ( url.pathname ) {
      case "/":
        // Logged in people need to be sent Home
        await handleRootRedirect();
        break;
      case "/auth-callback":
        // Callback from Auth0, primary application authentication
        await handleAuthCallback( query );
        break;
      case "/add-identity-callback":
        // Identity authentication from Mastodon, Reddit, and Twitter
        await handleAddIdentityCallback( query );
        break;
      default:
        // No-op passthrough
        return null;        
    }
  } catch ( error ) {
    console.error( error );
    await handleCallbackError();
  }
};

export { handleRedirect }