import { FeedEngine } from "$lib/engines/notification-feed.js";

let cache = {
  feed: [],
  scrollPosition: 0
};

// Careful about the engine state here. We want to enforce a singleton interface.
// But we have asynchronous instantiation behavior. Assign promise before falling
// through to resolving the promise.

// See the FeedEngine notes, this should be re-written as a state machine.
const getEngine = async function ({ view }) {
  if ( cache.engine == null ) {
    cache.engine = FeedEngine.create({ view });
  }

  cache.engine = await cache.engine;
  return cache.engine;
};

const setEngine = function ( engine ) {
  cache.engine = engine;
};

const getFeed = function () {
  return cache.feed;
};

const setFeed = function ( feed ) {
  cache.feed = feed;
};

const getScrollPosition = function () {
  return cache.scrollPosition;
};

const setScrollPosition = function ( y ) {
  cache.scrollPosition = y;
};

const reset = async function ({ view }) {
  const engine = await getEngine({ view });
  cache.engine = engine.reset({ view });

  cache = {
    feed: [],
    scrollPosition: 0,
    engine: await getEngine({ view })
  };
};

export {
  getEngine,
  setEngine,
  getFeed,
  setFeed,
  getScrollPosition,
  setScrollPosition,

  reset,
}