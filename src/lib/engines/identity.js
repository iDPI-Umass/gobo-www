import * as Resource from "$lib/resources/identity.js";
import * as identityStores from "$lib/stores/identity.js";
import { App } from "$lib/engines/account.js";

let singletonList;


const Identity = {};

Identity.list = async () => {
  return await Resource.list();
};

Identity.read = async () => {
  if ( singletonList == null ) {
    singletonList = Identity.list();
  }
  return singletonList = await singletonList;
};

Identity.write = () => {
  singletonList;
}

Identity.put = () => {
  identityStores.singleton.put( singletonList );
};

Identity.findIndex = async ( id ) => {
  const list = await Identity.read();
  const index = list.findIndex( i => i.id == id ); // TODO: Until we fix ID types.
  if ( index < 0 ) {
    throw new Error( `unable to find identity ${ id }` );
  }
  return index;
};

Identity.find = async ( id ) => {
  const list = await Identity.read();
  const match = list.find( i => i.id == id ); // TODO: Until we fix ID types.
  if ( match == null ) {
    throw new Error( `unable to find identity ${ id }` );
  }
  return match;
};

Identity.findActive = async () => {
  const list = await Identity.read();
  return list.filter( i => i.active === true );
};

Identity.updateAll = () => {
  Identity.write();
  Identity.put();
};

Identity.load = async () => {
  await Identity.read();
  Identity.updateAll();
};

Identity.refresh = async () => {
  singletonList = Identity.list();
  Identity.load();
};

Identity.update = async ( identity ) => {
  const match = await Identity.find( identity.id );
  Object.assign( match, identity );
  Identity.updateAll();
  await Resource.setActiveState( identity );
};

Identity.remove = async ( identity ) => {
  const list = await Identity.read();
  const index = await Identity.findIndex( identity.id );
  list.splice( index, 1 );
  Identity.updateAll();
  await Resource.remove( identity );
};

Identity.avatar = ( identity ) => {
  return identity.profile_image || Identity.fallback( identity );
};

Identity.fallback = ( identity ) => {
  switch ( identity.platform ) {
    case "mastodon":
    case "smalltown":
      return "/icons/mastodon-avatar.png";
    case "bluesky":
      return "/icons/bluesky-avatar.png";
    case "reddit":
      return "/icons/reddit-avatar.png";
  }
};



const Name = {};
Name.split = ( name ) => {
  const output = [];
  let current = [];
  
  for ( const c of name ) {
    if ( c === "@" ) {
      output.push( current.join( "" ));
      current = [ "@" ];
    } else if ( c === "." ) {
      output.push( current.join( "" ));
      current = [ "." ];
    } else {
      current.push( c );
    }
  }

  output.push( current.join( "" ));
  return output;
};


// Special instantiation, when logged in, to pull data and send to listeners.
// This cuts down on requests to the API and manages race conditions.
Identity.startup = async () => {
  if ( (await App.isAllowedAccess()) ) {
    await Identity.load();
  }
};

App.register( Identity.startup );




export {
  Identity,
  Name
}