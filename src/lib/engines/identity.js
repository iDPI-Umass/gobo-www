import * as Resource from "$lib/resources/identity.js";
import { identityStore } from "$lib/stores/identity.js";

let singletonList;


const Identity = {};

Identity.list = async () => {
  return await Resource.list();
};

Identity.read = async () => {
  if ( singletonList == null ) {
    singletonList = await Identity.list(); 
  }
  return singletonList;
};

Identity.write = () => {
  singletonList;
}

Identity.put = () => {
  identityStore.put( singletonList );
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

Identity.update = async ( identity ) => {
  const list = await Identity.read();
  const match = await Identity.find( identity.id );
  Object.assign( match, identity );
  Identity.updateAll();
};

Identity.updateActive = async ( identity ) => {
  await Identity.update( identity );
  await Resource.setActiveState( identity );
};


export {
  Identity
}