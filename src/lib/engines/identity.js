import * as Resource from "$lib/resources/identity.js";
import * as identityStores from "$lib/stores/identity.js";

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

Identity.update = async ( identity ) => {
  console.log("updating")
  const match = await Identity.find( identity.id );
  Object.assign( match, identity );
  Identity.updateAll();
  await Resource.setActiveState( identity );
};

Identity.remove = async ( identity ) => {
  const list = await Identity.read();
  const index = await Identity.findIndex( filter.id );
  list.splice( index, 1 );
  Identity.updateAll();
  await Resource.remove( identity );
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


export {
  Identity,
  Name
}