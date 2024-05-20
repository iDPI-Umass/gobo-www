import * as Value from "@dashkite/joy/value";
import { App } from "$lib/engines/account.js";
import { createStore } from "$lib/engines/store.js";
import { Identity } from "$lib/engines/identity.js";
import { Weave } from "$lib/engines/delivery/weave.js";
import * as stores from "$lib/stores/delivery.js";
import * as DeliveryHTTP from "$lib/resources/delivery.js";
import { Feed as Weaver } from "$lib/resources/person-delivery-feeds/all.js";
import * as DraftHTTP from "$lib/resources/draft.js";
import * as ProofHTTP from "$lib/resources/proof.js";
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




class Draft {
  constructor( _, attachments ) {
    this._ = _;
    this.attachments = attachments;
  }

  get id() {
    return this._.id;
  }

  get store() {
    return this._.store;
  }

  static async create( raw ) {
    const { attachments, ...store } = raw;

    store.files = [];
    for ( const draftFile of attachments ) {
      store.files.push( draftFile.id );
    }
    
    const kernel = { 
      store,
      state: "drafting"
    };
    
    const draft = await DraftHTTP.create( kernel );
    return new Draft( draft, attachments );
  }

  async upload() {
    for ( const draftFile of this.attachments ) {
      await draftFile.upload();
    }
  }
}


class Proof {
  constructor( _ ) {
    this._ = _;
  }

  get id() {
    return this._.id;
  }

  get files() {
    return this._.files;
  }

  static async create( draft ) {
    const kernel = {};
    kernel.content = draft.store.content;
    kernel.title = draft.store.options?.general?.title ?? undefined;
    // kernel.poll = {};
    kernel.files = draft.store.files;
    kernel.state = "pending";

    const proof = await ProofHTTP.create( kernel );
    return new Proof( proof );
  }
}


class DeliveryTarget {
  constructor( _ ) {
    this._ = _;
  }

  get id() {
    return this._.id;
  }
}


// We need a full class for the delivery abstract model to support its
// multiplicity on top of its complex internal state and reactivity.

class Delivery {
  constructor( _ ) {
    this._ = _;
  }

  get id() {
    return this._.id;
  }

  static async create( draft ) {
    const proof = await Proof.create( draft );

    const kernel = { 
      draft_id: draft.id,
      proof_id: proof.id
    };

    const delivery = await DeliveryHTTP.create( kernel );
    return new Delivery( delivery );
  }

  static async get( id ) {
    const graph = await DeliveryHTTP.get({ id });
    const weave = await Weave.make( graph );
    return weave.deliveries[ weave.feed[0] ];
  }

  static async unpublish( delivery ) {
    return await DeliveryHTTP.unpublish( delivery );
  } 
}


export {
  Feed,
  Deliveries,
  Draft,
  Delivery,
}