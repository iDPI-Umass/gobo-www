import { goto } from "$app/navigation";
import { getClient } from "./auth0.js";


export async function handleAuthCallback () {
  const client = await getClient();

  if (location.search.includes("state=") && 
      ( location.search.includes("code=") || 
      location.search.includes("error="))) {
    await client.handleRedirectCallback();
    console.log("handling redirect callback");
    throw goto( "/home" );
  }

  return {};
};