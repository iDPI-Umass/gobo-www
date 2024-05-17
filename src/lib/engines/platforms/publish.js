import { Draft, Delivery } from "$lib/engines/delivery.js";
import { Metadata } from "$lib/engines/platforms/metadata.js";


const Publish = {};

Publish.buildTargets = async ( raw ) => {
  const targets = [];
  for ( const identity of raw.identities ) {
    if ( identity.active === true ) {
      try {
        const metadata = await Metadata.build( identity, raw );
        targets.push({ identity: identity.id, metadata });
      } catch ( error ) {
        console.error( error );
        Delivery.pushAlert( `Unable to prepare post for platform ${ identity?.platform }.` );
        targets.push( false );
      }
    }
  }

  return targets;
};

Publish.setup = async ( raw ) => {
  const draft = await Draft.create( raw )
  const delivery = await Delivery.create( draft.draft );
  const targets = await Publish.buildTargets( raw );
  if ( targets === false ) {
    throw new Error( "early return" );
  } else {
    return { draft, delivery, targets };
  }
};

Publish.start = async function ({ draft, delivery, targets }) {
  try {
    await draft.upload();
  } catch ( error ) {
    console.error( "failed to upload attachments" );
    console.error( error );
    return;
  }
  
  const newPost = {
    delivery_id: delivery.delivery.id,
    draft_id: draft.draft.id,
    targets
  };

  try {
    return await PostHTTP.publish( newPost );   
  } catch ( error ) {
    console.error( error );
  }
};




export {
  Publish
}