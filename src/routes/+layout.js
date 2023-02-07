import { browser } from "$app/environment";
import { handleAuthCallback } from "$lib/helpers/auth-callback.js";

export const load = async function ( page ) {
  if ( browser ) {
    await handleAuthCallback();
  } else {
    return {};
  } 
};