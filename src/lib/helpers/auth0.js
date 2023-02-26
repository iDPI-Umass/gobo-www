import { createAuth0Client } from '@auth0/auth0-spa-js';

let client;

const getClient = async function () {
  if ( client == null ) {
    client = await createAuth0Client({
      domain: "dev-j72vlrggk1ft8e8u.us.auth0.com",
      clientId: "urDJOCUizzQm4LZ7kv5UQsdIYEnOCuwG",
      authorizationParams: {
        redirect_uri: "http://localhost:4173/callback"
      }
    });
  }

  return client;
};


export { getClient };
