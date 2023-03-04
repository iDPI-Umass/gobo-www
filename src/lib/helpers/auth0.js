import { createAuth0Client } from '@auth0/auth0-spa-js';
import { 
  PUBLIC_AUTH_DOMAIN,
  PUBLIC_AUTH_CLIENT_ID,
  PUBLIC_AUTH_REDIRECT_URL,
  PUBLIC_AUTH_AUDIENCE
} from '$env/static/public';


let client;

const getClient = async function () {
  if ( client == null ) {
    client = await createAuth0Client({
      domain: PUBLIC_AUTH_DOMAIN,
      clientId: PUBLIC_AUTH_CLIENT_ID,
      cacheLocation: "localstorage",
      authorizationParams: {
        redirect_uri: PUBLIC_AUTH_REDIRECT_URL,
        audience: PUBLIC_AUTH_AUDIENCE
      }
    });
  }

  return client;
};


export { getClient };
