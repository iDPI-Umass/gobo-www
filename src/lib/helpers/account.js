import * as Bake from "@dashkite/bake";
import setupGOBOClient from "gobo-client";
import * as Cache from "$lib/helpers/cache.js";
import { getAuth0Client } from "$lib/helpers/auth0.js";
import { profileStore } from "$lib/stores/profile.js";
import { 
  PUBLIC_AUTH_LOGOUT_URL,
  PUBLIC_GOBO_API
} from '$env/static/public';

let account, goboClient;

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
  if ( account != null ) {
    return account;
  }

  const client = await getAuth0Client();
  account = await client.getUser();
  account.token = await client.getTokenSilently({ detailedResponse: true });
  account.permissions = extractPermissions( account );
  return account;
};

const getGOBOClient = async function () {
  if ( goboClient != null ) {
    return goboClient;
  }

  let account = await getAccount();

  goboClient = setupGOBOClient({
    base: PUBLIC_GOBO_API,
    debug: 1,
    token: account.token.access_token
  })

  return goboClient;
};

const fetchProfile = async function () {
  const client = await getGOBOClient();
  const profile = await client.me.get();
  
  let { name } = profile;
  if ( name == null || name == "" ) {
    profile.name = account.email;
  }

  profileStore.setProfile( profile );
  return profile;
};

const getProfile = async function () {
  const now = new Date().toISOString();
  let match = Cache.read( "profile" );

  if ( ( match == null ) || ( match.expires < now ) ) {
    const profile = await fetchProfile();
    match = Cache.write( "profile", 86400, profile );
  }

  return match.value;
};

const logout = async function () {
  account = null;
  goboClient = null;
  profileStore.logout();

  const client = await getAuth0Client();
  client.logout({
    logoutParams: {
      returnTo: PUBLIC_AUTH_LOGOUT_URL
    }
  })
};

const isLoggedOut = function () {
  return account == null;
};

export { 
  getAccount,
  getGOBOClient,
  getProfile,
  logout,
  isLoggedOut
}



