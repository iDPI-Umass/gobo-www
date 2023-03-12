import * as Bake from "@dashkite/bake";
import * as Cache from "$lib/helpers/cache.js";
import { getAuth0Client } from "$lib/helpers/auth0.js";
import { buildGOBOClient } from "$lib/helpers/gobo.js";
import { profileStore } from "$lib/stores/profile.js";
import { PUBLIC_AUTH_LOGOUT_URL } from '$env/static/public';

let account, goboClient, profile;

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

  goboClient = buildGOBOClient({ account: await getAccount() });
  return goboClient;
};

const setProfile = async function () {
  const client = await getGOBOClient();
  profile = await client.getProfile();
  
  if ( profile.display_name == "" ) {
    profile.display_name = account.email;
  }

  profileStore.setProfile( profile );
};

const refreshProfile = async function () {
  const now = new Date().toISOString();
  const match = Cache.read( "profile" );

  if ( ( match == null ) || ( match.expires < now ) ) {
    await setProfile();
    Cache.write( "profile", 86400, profile );
  }
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
  setProfile,
  refreshProfile,
  logout,
  isLoggedOut
}



