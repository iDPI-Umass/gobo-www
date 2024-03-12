import * as Bake from "@dashkite/bake";
import setupGOBOClient from "gobo-client";
import * as Cache from "$lib/helpers/cache.js";
import { getAuth0Client } from "$lib/helpers/auth0.js";
import { profileStore } from "$lib/stores/profile.js";
import { 
  PUBLIC_AUTH_LOGOUT_URL,
  PUBLIC_GOBO_API
} from '$env/static/public';


const extractPermissions = function ( account ) {
  const encoded = account?.token?.access_token.split(".")[1];

  if ( encoded == null ) {
    return new Set();
  }

  const decoded = Bake.convert( { from: "base64", to: "utf8" }, encoded );
  const payload = JSON.parse( decoded );
  return new Set( payload.permissions );
};


const getAccount = async function() {
  const now = new Date().toISOString();
  let match = Cache.read( "account" );

  if ( match == null ) {
    const client = await getAuth0Client();
    const account = await client.getUser();
    account.token = await client.getTokenSilently({ detailedResponse: true });
    account.permissions = extractPermissions( account );
    match = Cache.write( "account", 43200, account );
  }

  return match.value;
};

const getGOBOClient = async function () {
  const now = new Date().toISOString();
  let match = Cache.read( "gobo-client" );

  if ( match == null ) {
    const account = await getAccount();
    const client = await setupGOBOClient({
      base: PUBLIC_GOBO_API,
      debug: 1,
      token: account.token.access_token
    });
    const profile = await client.me.get();
    client.setProfile( profile );
    match = Cache.write( "gobo-client", 3600, client );
  }

  return match.value;
};

const fetchProfile = async function () {
  const client = await getGOBOClient();
  let profile;
  try {
    profile = await client.me.get();
  } catch (error) {
    if ( error.status === 401 ) {
      await logout();
    } else {
      throw error;
    }
  }
  
  
  let { name } = profile;
  if ( (name == null) || (name == "") ) {
    const account = await getAccount();
    profile.name = account.email;
  }

  profileStore.setProfile( profile );
  return profile;
};

const getProfile = async function () {
  const now = new Date().toISOString();
  let match = Cache.read( "profile" );

  if ( match == null ) {
    const profile = await fetchProfile();
    match = Cache.write( "profile", 43200, profile );
  }

  return match.value;
};

const logout = async function () {
  Cache.remove( "account" );
  Cache.remove( "profile" );
  Cache.remove( "gobo-client" );
  profileStore.logout();

  const client = await getAuth0Client();
  client.logout({
    logoutParams: {
      returnTo: PUBLIC_AUTH_LOGOUT_URL
    }
  })
};

// Temporary solution to deal with token expiration not being handled by main
// account helpers during fetch.
const handleUnauthorized = function ( f ) {
  return async function ( ...args ) {
    try {
      return await f( ...args );
    } catch ( error ) {
      if ( error.status === 401 ) {
        await logout();
        return null;
      } else {
        throw error
      }
    }
  }
};

const isLoggedIn = async () => {
  const client = await getAuth0Client();
  return await client.isAuthenticated() === true;
};

const isLoggedOut = async () => {
  return !(await isLoggedIn());
};



export { 
  getAccount,
  getGOBOClient,
  getProfile,
  logout,
  isLoggedIn,
  isLoggedOut,
  handleUnauthorized
}



