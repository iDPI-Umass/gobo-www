import { Draft, Delivery } from "$lib/engines/delivery/index.js";
import { Metadata } from "$lib/engines/platforms/metadata.js";
import * as PostHTTP from "$lib/resources/post.js";


const Publish = {};

Publish.buildTargets = async ( raw ) => {
  const targets = [];
  for ( const identity of raw.identities ) {
    if ( identity.active === true ) {
      try {
        const stash = await Metadata.build( identity, raw );
        targets.push({ identity: identity.id, stash });
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
  for ( const draftFile of raw.attachments ) {
    await draftFile.create();
  }
  const draft = await Draft.create( raw )
  const delivery = await Delivery.create( draft );
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
    delivery_id: delivery.id,
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