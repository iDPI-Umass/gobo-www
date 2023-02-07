import { createAuth0Client } from '@auth0/auth0-spa-js';

let client;

const getClient = async function () {
  if ( client == null ) {
    client = await createAuth0Client({
      domain: "dev-ojjfq612raektsix.us.auth0.com",
      clientId: "lES364F2EGwj6SiRwJ5zxtPWm2pLLmI1",
      authorizationParams: {
        redirect_uri: "http://localhost:5173/home"
      }
    });
  }

  return client;
};


export { getClient };
