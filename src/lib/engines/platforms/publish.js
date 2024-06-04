import * as Value from "@dashkite/joy/value";
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

Publish.uploadMedia = async ( draft ) => {
  try {
    await draft.upload();
    return true;
  } catch ( error ) {
    console.error( error );
    Delivery.pushAlert( "failed to upload attachments" );
    return false;
  }
}

Publish.setup = async ( _raw ) => {
  const raw = Value.clone( _raw );
  
  for ( const draftFile of raw.attachments ) {
    await draftFile.create();
  }
  const draft = await Draft.create( raw )
  const delivery = await Delivery.create( draft );
  const targets = await Publish.buildTargets( raw );
  if ( targets === false ) {
    throw new Error( "early return" );
  }

  const media = await Publish.uploadMedia( draft );
  if ( media === false ) {
    throw new Error( "early return" );
  }
  
  return { draft, delivery, targets };
};

Publish.start = async function ({ draft, delivery, targets }) {
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