import { Bluesky as BlueskyClient } from "$lib/clients/bluesky/index.js";

// Documentation here:
// https://atproto.com/specs/handle#handle-identifier-syntax

const Bluesky = {};

Bluesky.mentionFromName = ( name = "" ) => {
  // "Handles are not case-sensitive, and should be normalized to lowercase"
  return name.toLowerCase();
};

Bluesky.isHandle = ( string = "" ) => {
  const baseRules = /^@[a-z0-9.-]+$/i.test(string) &&
    (string.length < 253)

  if (!baseRules) {
    return false;
  }

  const labels = string.split( "." );
  return labels.length >= 2 &&
    labels.every( label => label.length >= 1 && label.length <= 63 ) &&
    labels.every( label => /^[^-]/.test(label) ) &&
    labels.every( label => /[^-]$/.test(label) )
};

Bluesky.resolveType = ( string ) => {
  if ( Bluesky.isHandle(string) ) {
    return "handle";
  } else {
    return "placeholder";
  }
}


let clientSingleton;

Bluesky.getClient = ( identity ) => {
  if (!clientSingleton) {
    clientSingleton = BlueskyClient.create();
  }
  return clientSingleton;
}

Bluesky._getSuggestions = async ( identity, query ) => {
  const client = Bluesky.getClient( identity );
  return client.getAccountSuggestions( query );
};

Bluesky.getSuggestions = async ( identity, query ) => {
  const { actors } = await Bluesky._getSuggestions( identity, query );
  const output = [];
  for ( const actor of actors ) {
    output.push({
      id: window.crypto.randomUUID(),
      displayName: actor.displayName,
      handle: "@" + actor.handle,
      avatar: actor.avatar
    });
  }

  return output;
}

export {
  Bluesky
}