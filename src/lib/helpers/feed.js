import * as Value from "@dashkite/joy/value";
import * as Store from "$lib/resources/store.js";
import * as Identity from "$lib/resources/identity.js";
import { Feed } from "$lib/resources/feed.js";


/***
While the classes within "$lib/resources/feed" are focused on a more formal
composition of HTTP feed resources, the classes below are a more tactical
composition of application resources, a layer between the Svelte application
interfaces and with the feed composite.

Some of the awkwardness comes from the fact that, for now, we are focused on
providing a reverse-chronological feeds coming off identities. 
Soon, we'll need further generalization in this layer to handle configuration
of interfaces that draw on feeds coming off lens calculations.
***/

class FeedEngine {
  constructor ({ feed }) {
    this.feed = feed;
  }

  static async create () {
    const identities = await getActiveIdentities();
    const feed = await Feed.create({ identities });
    return new FeedEngine({ feed });
  }

  async pull ( count ) {
    const results = [];

    for ( let i = 0; i < count - 1; i++ ) {      
      const result = await this.feed.next();
      if ( result != null ) {
        results.push( result );
      }
    }

    return results;
  }
}

const getFeedConfig = async function () {
  let store = await Store.get( "feed" );
  if ( store == null ) {
    store = await Store.put( "feed", {} );
  }
  return store.content;
};

const updateFeedConfig = async function ( content ) {
  await Store.put( "feed", content );
  return content;
}

const sort = function ( ax ) {
  return ax.sort( function ( a, b ) {
    if ( a.id < b.id ) {
      return -1;
    } else {
      return 1;
    }
  });
}

const getActiveIdentities = async function () {
  const active = [];
  const identities = await Identity.list();
  const feedConfig = await getFeedConfig();
  const configured = feedConfig.identities ?? [];

  const current = []
  for ( const identity of identities ) {
    const match = configured.find( x => x.id === identity.id );
    
    if ( match == null ) {
      current.push({ id: identity.id, active: true });
      active.push( identity );
    } else {
      current.push( match );
      if ( match.active === true ) {
        active.push( identity );
      }
    }
  }
  
  sort( current );
  if ( Value.equal( configured, current ) === false ) {
    await updateFeedConfig({ ...feedConfig, identities: current });
  }

  return active;
};



const getIdentities = async function () {
  const identities = await Identity.list();
  const feedConfig = await getFeedConfig();
  for ( const identity of identities ) {
    const active = feedConfig.identities?.find( i => i.id == identity.id )?.active
    identity.active = active ?? true;
  }
  return identities;
};

const removeIdentity = async function ( identity ) {
  const feedConfig = await getFeedConfig();
  const identities = feedConfig.identities ?? [];
  const index = identities.findIndex( i => i.id === identity.id );
  if ( index > -1 ) {
    identities.splice( index, 1 );
    await updateFeedConfig({ ...feedConfig, identities });
  }
};

const setIdentityActive = async function ( identity, active ) {
  const feedConfig = await getFeedConfig();
  const identities = feedConfig.identities ?? [];
  const index = identities.findIndex( i => i.id === identity.id );

  if ( index > -1 ) {
    identities[ index ].active = active
  } else {
    sort( identities.push({ id: identity.id, active }) );
  }

  await updateFeedConfig({ ...feedConfig, identities });
};


export {
  FeedEngine,

  getFeedConfig,
  updateFeedConfig,
  getActiveIdentities,

  getIdentities,
  removeIdentity,
  setIdentityActive
}