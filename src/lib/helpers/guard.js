import { onMount } from "svelte";
import { goto } from "$app/navigation";
import { browser } from "$app/environment";
import { getClient } from "./auth0.js";


const handleGuard = async function () {
  const client = await getClient();
  
  if ( await client.isAuthenticated() ) {
    return {};
  } else {
    goto("/");
  }
};

export async function guard() {
  if ( browser ) {
    onMount( async function () {
      await handleGuard();
    });
  }
}