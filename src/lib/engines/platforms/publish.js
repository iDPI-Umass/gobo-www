import * as Value from "@dashkite/joy/value";
import { Draft } from "$lib/engines/draft.js";
import { Validate } from "$lib/engines/platforms/validate.js";
import { Bluesky } from "$lib/engines/platforms/bluesky.js";
import { Linkedin } from "$lib/engines/platforms/linkedin.js";
import { Mastodon } from "$lib/engines/platforms/mastodon.js";
import { Reddit } from "$lib/engines/platforms/reddit.js";
import { Smalltown } from "$lib/engines/platforms/smalltown.js";
import * as File from "$lib/resources/draft-file.js";
import * as Post from "$lib/resources/post.js";
import * as deliveryStore from "$lib/stores/delivery.js";
import * as DeliveryHTTP from "$lib/resources/delivery.js";
import * as Random from "$lib/helpers/random.js";


const Metadata = {};

Metadata.build = async ( identity, draft ) => {
  switch ( identity.platform ) {
    case "bluesky":
      return await Bluesky.build( draft );
    case "linkedin":
      return await Linkedin.build( draft );
    case "mastodon":
      return Mastodon.build( draft );
    case "reddit":
      return Reddit.build( draft );
    case "smalltown":
      return Smalltown.build( draft );
    default:
      throw new Error("unknown platform type");
  }
};


const Publish = {};

Publish.build = ( draft ) => {
  const post = {};
  post.content = draft.content;
  post.title = draft.options?.general?.title ?? undefined;
  // post.poll = {};
  return post;
};


Publish.uploadAttachments = async ( uploads ) => {
  let earlyReturn = false;
  const ids = [];
  for ( const upload of uploads ) {
    try {
      const file = await File.create( upload );
      ids.push( file.id );
      upload.state = "uploaded";
      Delivery.updateAspect( "uploads", uploads );
    } catch ( error ) {
      console.error( error );
      upload.state = "error";
      earlyReturn = true;
      break;
    }
  }

  if ( earlyReturn ) {
    for ( const upload of uploads ) {
      if ( upload.state === "pending" ) {
        upload.state = "aborted"
      }
    }
    throw new Error();
  }

  return ids;
};


Publish.buildTargets = async ( draft ) => {
  const targets = [];
  for ( const identity of draft.identities ) {
    if ( identity.active === true ) {
      try {
        const metadata = await Metadata.build( identity, draft );
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


Publish.start = async function () {
  let post, targets;
  const delivery = Delivery.make();

  try {
    post = Publish.build( delivery.draft );
  } catch ( error ) {
    console.error( error );
    Delivery.pushAlert( "There was a problem assembling post data." );
    return;
  }

  try {
    post.attachments = await Publish.uploadAttachments( delivery.uploads );
  } catch ( error ) {
    Delivery.pushAlert( "Failed to upload images." );
    return;
  }
  
  targets = await Publish.buildTargets( delivery.draft );
  if ( targets.includes( false )) {
    return;
  }
 
  try {
    const { id } = await Post.publish( post, targets );
    delivery.id = id;
    Delivery.put( delivery );
    return;
  } catch ( error ) {
    console.error( error );
    Delivery.pushAlert( "Failed to submit post to Gobo API." );
    return;
  }
};


let singletonDelivery;
const Delivery = {};

Delivery.make = () => {
  const draft = Draft.read();
  const uploads = [];
  for ( const attachment of draft.attachments ) {
    uploads.push({ 
      state: "pending", 
      ...attachment
    });
  }

  const identities = draft.identities.filter( i => i.active === true );
  const targets = [];
  for ( const identity of identities ) {
    targets.push({
      state: "pending",
      ...Value.clone( identity )
    });
  }

  return Delivery.put({
    uploads,
    draft,
    targets,
    alerts: []
  });
};

Delivery.read = () => {
  return singletonDelivery;
};

Delivery.write = ( value ) => {
  singletonDelivery = value;
};

Delivery.put = ( value ) => {
  singletonDelivery = value;
  deliveryStore.singleton.put( value );
  deliveryStore.uploads.put( value.uploads );
  deliveryStore.draft.put( value.draft );
  deliveryStore.targets.put( value.targets );
  return value;
};

Delivery.updateAspect = ( name, value ) => {
  const delivery = Delivery.read();
  delivery[ name ] = value;
  Delivery.write( delivery );
  deliveryStore[ name ].put( value );
};

Delivery.pushAlert = ( message ) => {
  const delivery = Delivery.read();
  delivery.alerts.push({
    key: Random.address(),
    message
  });
  Delivery.updateAspect( "alerts", delivery.alerts );
};

Delivery.dismissAlert = ( key ) => {
  const delivery = Delivery.read();
  const index = delivery.alerts.findIndex( a => a.key === key );
  if ( index > -1 ) {
    delivery.alerts.splice( index, 1 );
    Delivery.updateAspect( "alerts", delivery.alerts );
  }
};

Delivery.clearAlerts = () => {
  Delivery.updateAspect( "alerts", [] );
};

Delivery.sync = async () => {
  const local = Delivery.read();
  if ( local.id != null ) {
    const delivery = await DeliveryHTTP.get( local );
    
    for ( const target of delivery.targets) {
      const identity = local.targets.find( t => t.id === target.identity )
      if ( identity != null ) {
        identity.state = target.state;
      }
    }

    Delivery.updateAspect( "targets", local.targets );
  }
};


export {
  Publish,
  Delivery
}