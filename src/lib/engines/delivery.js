import * as Value from "@dashkite/joy/value";
import { Feed as Weaver } from "$lib/resources/person-delivery-feeds/all.js";
import * as stores from "$lib/stores/delivery.js";
import { App } from "$lib/engines/account.js";
import { createStore } from "$lib/engines/store.js";
import { Identity } from "$lib/engines/identity.js";
import * as DeliveryHTTP from "$lib/resources/delivery.js";
import * as Random from "$lib/helpers/random.js";



// Deliveries have similar needs to the main post feed, so we use similar
// patterns. See lib/engines/feed.js for more background.

let singletonFeed;

const Feed = {};

Feed.make = async ( context = {} ) => {
  return {
    deliveries: [],
    weaver: await Weaver.make(),
    isStopped: false,
  };
};

Feed.write = () => {
  singletonFeed;
};

Feed.read = async () => {
  if ( singletonFeed == null ) {
    singletonFeed = Feed.make();
  }
  return singletonFeed = await singletonFeed;
};

Feed.put = () => {
  stores.feed.put( singletonFeed );
};

Feed.command = ( name ) => {
  stores.command.put({ name });
};

Feed.update = () => {
  Feed.write();
  Feed.put();
};

Feed.load = async () => {
  await Feed.read();
  Feed.update();
};

Feed.halt = () => {
  if ( singletonFeed != null ) {
    singletonFeed.isStopped = true;
  }
};

Feed.clear = async ({ view }) => {
  // Halt feed weaver pulling before discarding old object.
  Feed.halt();
  singletonFeed = Feed.make({ view });
  singletonFeed = await singletonFeed
};

Feed.refresh = async ( context = {} ) => {
  const view = context.view ?? "all";
  await Feed.clear({ view });
  Feed.command( "refresh" );
};


Feed.next = async () => {
  const feed = await Feed.read();
  return await feed.weaver.next();
};

Feed.pull = async ( count ) => {
  const results = [];
  let current = 0;

  while ( current < count ) {
    if ( Feed.isStopped === true ) {
      return;
    }

    const result = await Feed.next();
    if ( result == null ) {
      // We're at the bottom of the feed.
      // TODO: Responding to this condition would be different for non-time-based feed sorting.
      break;
    
    } else {
      results.push( result );
      current++;
    }
  }
 
  if ( Feed.isStopped === true ) {
    return;
  }
  
  await Deliveries.push( results );
};


const Deliveries = {};

Deliveries.read = async () => {
  const feed = await Feed.read();
  return feed.deliveries;
};

Deliveries.update = async ( deliveries ) => {
  const feed = await Feed.read();
  feed.deliveries = deliveries;
  Feed.update();
};

Deliveries.push = async ( deliveries ) => {
  const feed = await Feed.read();
  feed.deliveries.push( ...deliveries );
  Feed.update();
};




// Special instantiation, when logged in, to pull data and send to listeners.
// This cuts down on requests to the API and manages race conditions.
Feed.startup = async () => {
  if ( (await App.isAllowedAccess()) ) {    
    // Pull down feed data.
    await Feed.refresh();
  }
};

App.register( Feed.startup );



// We need a full class for the delivery abstract model to support its
// multiplicity on top of its complex internal state and reactivity.

class Delivery {
  constructor( delivery ) {
    this.delivery = delivery;
    this.stores = {
      singleton: createStore(),
      uploads: createStore(),
      draft: createStore(),
      targets: createStore(),
      alerts: createStore(),
    };
    this.update();
  }

  static make( draft ) {
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

    return new Delivery({
      uploads,
      draft,
      targets,
      alerts: []
    });
  }

  static async fromResource( resource ) {
    const targets = [];
    for ( const reference of resource.targets ) {
      const identity = await Identity.find( reference.identity );
      if ( identity == null ) {
        continue;
      }
      targets.push({ 
        state: reference.state,
        ...Value.clone( identity )
      });
    }

    return new Delivery({
      id: resource.id,
      uploads: [],
      draft: {},
      targets,
      alerts: []
    });
  }


  update( value ) {
    value ??= this.delivery;
    this.delivery = value;
    this.stores.singleton.put( value );
    this.stores.uploads.put( value.uplods );
    this.stores.draft.put( value.draft );
    this.stores.targets.put( value.targets );
    this.stores.alerts.put( value.alerts );
    return value;
  }

  updateAspect( name, value ) {
    this.delivery[ name ] = value;
    this.stores[ name ].put( value );
  }

  pushAlert( message ) {
    this.delivery.alerts.push({
      key: Random.address(),
      message
    });
    this.updateAspect( "alerts", this.delivery.alerts );
  }

  dismissAlert( key ) {
    const index = this.delivery.alerts.findIndex( a => a.key === key );
    if ( index > -1 ) {
      this.delivery.alerts.splice( index, 1 );
      this.updateAspect( "alerts", this.delivery.alerts );
    }
  }

  clearAlerts() {
    this.updateAspect( "alerts", [] );
  }

  async sync () {
    const local = this.delivery;
    if ( local.id != null ) {
      const delivery = await DeliveryHTTP.get( local );
    
      for ( const target of delivery.targets ) {
        const identity = local.targets.find( t => t.id === target.identity )
        if ( identity != null ) {
          identity.state = target.state;
        }
      }

      this.updateAspect( "targets", local.targets );
    }
  }
}


export {
  Feed,
  Deliveries,
  Delivery,
}