import * as Bake from "@dashkite/bake";
import { createAuth0Client } from "@auth0/auth0-spa-js";
import createGoboClient from "gobo-client";
import { profileStore } from "$lib/stores/profile.js";
import {
  PUBLIC_AUTH_DOMAIN,
  PUBLIC_AUTH_CLIENT_ID,
  PUBLIC_AUTH_REDIRECT_URL,
  PUBLIC_AUTH_AUDIENCE,
  PUBLIC_AUTH_LOGOUT_URL,
  PUBLIC_GOBO_API,
} from '$env/static/public';



let singletonClients = {};

const Clients = {};

Clients.getAuth0 = async () => {
  if ( singletonClients.auth0 == null ) {
    singletonClients.auth0 = createAuth0Client({
      domain: PUBLIC_AUTH_DOMAIN,
      clientId: PUBLIC_AUTH_CLIENT_ID,
      cacheLocation: "localstorage",
      authorizationParams: {
        redirect_uri: PUBLIC_AUTH_REDIRECT_URL,
        audience: PUBLIC_AUTH_AUDIENCE
      }
    });
  }
  return singletonClients.auth0 = await singletonClients.auth0;
};

Clients.getGobo = async () => {
  if ( singletonClients.gobo == null ) {
    singletonClients.gobo = new Promise( (resolve, reject) => {

    })

    singletonClients.gobo = (async () => {
      return await createGoboClient({
        base: PUBLIC_GOBO_API,
        debug: 1,
        token: await Token.get( "access" ),
      });
    })();
  }
  return singletonClients.gobo = await singletonClients.gobo;
};

Clients.refresh = () => {
  singletonClients = {};
};



let singletonAccount;
const Account = {};

Account.fetch = async () => {
  const client = await Clients.getAuth0();
  return await client.getUser();
};


Account.read = async () => {
  if ( singletonAccount == null ) {
    singletonAccount = Account.fetch();
  }

  return singletonAccount = await singletonAccount;
};

Account.refresh = () => {
  singletonAccount = null;
};


let singletonToken;
const Token = {};

Token.fetch = async () => {
  const client = await Clients.getAuth0();
  return await client.getTokenSilently({ detailedResponse: true });
};

Token.decode = ( token ) => {
  const encoded = token?.access_token.split(".")[1];

  if ( encoded == null ) {
    return {};
  }

  const decoded = Bake.convert({ from: "base64", to: "utf8" }, encoded );
  return JSON.parse( decoded );
};

/* 
  As we transition into open beta / general access, we need to indicate who
  is allowed to access the application.

  We allow legacy private beta testers into this new regime by continuing to
  check for the "general" permission we assigned them.

  For newcomers, the only requirement is that account must have verified their
  email address. We check for that in the Auth0 authority and sign that
  determination within a custom claim. We check for that claim here.
*/
Token.confirmAccess = ( claims ) => {
  // const isVerified = claims[ "https://gobo.social/verified" ] ?? false;
  const isVerified = false;
  const permissions = new Set( claims.permissions );
  return isVerified || permissions.has( "general" );
};

// Hold onto tokens for 12 hours before trying to refresh.
// TODO: Revisit this expiration duration.
Token.setExpires = () => {
  const date = new Date();
  date.setUTCHours( date.getUTCHours() + 12 );
  return date.toISOString();
};

Token.make = async () => {
  const token = await Token.fetch();
  const claims = Token.decode( token );

  return {
    token: token,
    claims: claims,
    allowedAccess: Token.confirmAccess( claims ),
    expires: Token.setExpires(),
  };
};

Token.read = async () => {
  if ( singletonToken == null ) {
    singletonToken = Token.make();
  }

  const bundle = await singletonToken;
  const now = (new Date).toISOString();

  if ( bundle.expires < now ) {
    singletonToken = Token.make();
    return singletonToken = await singletonToken;
  } else {
    return bundle;
  }
};

Token.get = async ( type ) => {
  const bundle = await Token.read();
  switch ( type ) {
    case "access":
      return bundle.token.access_token;
    default:
      throw new Error( `unable to retrieve token type ${ type }` );
  }
};

Token.isAllowedAccess = async () => {
  const bundle = await Token.read();
  return bundle.allowedAccess;
};

Token.refresh = () => {
  singletonToken = null;
};



let singletonGobo;
const Gobo = {};

// Hold onto tokens for 12 hours before trying to refresh.
// TODO: Revisit this expiration duration.
Gobo.setExpires = () => {
  const date = new Date();
  date.setUTCHours( date.getUTCHours() + 1 );
  return date.toISOString();
}

Gobo.make = async () => {
  const client = await Clients.getGobo();
  const profile = await client.me.get();
  client.setProfile( profile );
  return {
    client: client,
    profile: profile,
    expires: Gobo.setExpires(),
  };
};

Gobo.read = async () => {
  if ( singletonGobo == null ) {
    singletonGobo = Gobo.make();
  }

  const bundle = await singletonGobo;
  const now = (new Date).toISOString();

  if ( bundle.expires < now ) {
    singletonGobo = Gobo.make();
    return singletonGobo = await singletonGobo;
  } else {
    return bundle;
  }
};

Gobo.get = async () => {
  const bundle = await Gobo.read();
  return bundle.client;
}

Gobo.refresh = () => {
  singletonGobo = null;
}


let singletonProfile;
const Profile = {};

Profile.fetch = async () => {
  try {
    const bundle = await Gobo.read();
    return bundle.profile;
  } catch ( error ) {
    if ( error.status === 401 ) {
      await App.logout();
    } else {
      throw error;
    }
  }
};

Profile.make = async () => {
  const profile = await Profile.fetch();
  
  let { name } = profile;
  if ( (name == null) || (name == "") ) {
    const account = await Account.read();
    profile.name = account.email;
  }

  return profile;
};

Profile.read = async () => {
  if ( singletonProfile == null ) {
    singletonProfile = Profile.make();
  }
  return singletonProfile = await singletonProfile;
};

Profile.update = ( profile ) => {
  profileStore.setProfile( profile );
};

Profile.load = async () => {
  if ( (await App.isAllowedAccess()) ) {
    const profile = await Profile.read();
    Profile.update( profile );
  }
};

Profile.refresh = () => {
  singletonProfile = null;
};



const App = {};

App.logout = async () => {
  profileStore.logout();
  const client = await Clients.getAuth0();
  await App.refresh();
  client.logout({
    logoutParams: {
      returnTo: PUBLIC_AUTH_LOGOUT_URL
    }
  });
};



// Temporary solution to deal with token expiration not being handled by main
// account helpers during fetch.
App.unauthorized = ( f ) => {
  return async ( ...args ) => {
    try {
      return await f( ...args );
    } catch ( error ) {
      if ( error.status === 401 ) {
        await App.logout();
        return null;
      } else {
        throw error
      }
    }
  }
};


App.isLoggedIn = async () => {
  const client = await Clients.getAuth0();
  return await client.isAuthenticated() === true;
};

App.isLoggedOut = async () => {
  return !(await App.isLoggedIn());
};

App.isAllowedAccess = async () => {
  return (await App.isLoggedIn()) && (await Token.isAllowedAccess());
};

App.startupList = [];
App.register = ( f ) => App.startupList.push( f );
App.startup = async () => {
  const promises = [];
  for ( const f of App.startupList ) {
    promises.push( f() );
  }
  await Promise.all( promises );
};

App.register( Profile.load );

App.refresh = async () => {
  Clients.refresh();
  Account.refresh();
  Token.refresh();
  Gobo.refresh();
  Profile.refresh();
};


export {
  Clients,
  Account,
  Token,
  Gobo,
  Profile,
  App,
}