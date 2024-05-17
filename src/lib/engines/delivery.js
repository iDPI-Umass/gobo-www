import * as Value from "@dashkite/joy/value";
import { Feed as Weaver } from "$lib/resources/person-delivery-feeds/all.js";
import * as stores from "$lib/stores/delivery.js";
import { App } from "$lib/engines/account.js";
import { createStore } from "$lib/engines/store.js";
import { Identity } from "$lib/engines/identity.js";
import * as DeliveryHTTP from "$lib/resources/delivery.js";
import * as FileHTTP from "$lib/resources/draft-file.js";
import * as PostHTTP from "$lib/resources/post.js";
import * as DraftHTTP from "$lib/resources/draft.js";
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


// Eventually, we'll have a more organized way to handle multiple drafts
// to handle their media attachments. Until then, we include the File instance
// along with the Gobo file resource.
class DraftFile {
  constructor( file, attachment ) {
    this.file = file;
    this.attachment = attachment;
  }

  static async create( attachment ) {
    const file = await FileHTTP.create();
    attachment.id = file.id;
    return new DraftFile( file, attachment );
  }

  async upload() {
    if ( this.attachment != null ) {
      await FileHTTP.upload( this.attachment );
    }
  }

  async fail () {
    this.file.state = "error"
    try {
      await FileHTTP.update( this.file );
    } catch ( error ) {
      console.error( error );
    }
  }
}

class Draft {
  constructor( raw, draft, files ) {
    this._draft = raw;
    this.draft = draft;
    this.files = files ?? [];
  }

  static async create( raw ) {
    const kernel = {};
    kernel.content = raw.content;
    kernel.title = raw.options?.general?.title ?? undefined;
    // kernel.poll = {};
    kernel.files = [];
    kernel.state = "draft";

    const files = [];
    for ( const attachment of raw.attachments ) {
      const draftFile = await DraftFile.create( attachment );
      files.push( draftFile );
      kernel.files.push( draftFile.file.id );
    }

    const draft = await DraftHTTP.create( kernel );
    return new Draft( raw, draft, files );
  }

  async upload() {
    for ( const file of this.files ) {
      try {
        await file.upload();
      } catch ( error ) {
        console.warning( error );
        await file.fail();
      }
    }
  }
}


class DeliveryTarget {
  constructor( target ) {
    this.target = target;
  }
}


// We need a full class for the delivery abstract model to support its
// multiplicity on top of its complex internal state and reactivity.

class Delivery {
  constructor( graph ) {
    this.graph = graph;
  }

  static async create( draft ) {
    const kernel = { draft };
    const graph = await DeliveryHTTP.create( kernel );
    const delivery = new Delivery( graph );
    return delivery;
  }

  static make( graph ) {
    return new Delivery( graph );
  }
}


export {
  Feed,
  Deliveries,
  Draft,
  Delivery,
}