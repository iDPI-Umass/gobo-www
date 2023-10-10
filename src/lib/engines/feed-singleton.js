import { FeedEngine } from "$lib/engines/feed.js";

let cache = {
  feed: [],
  scrollPosition: 0
};

// Careful about the engine state here. We want to enforce a singleton interface.
// But we have asynchronous instantiation behavior. Assign promise before falling
// through to resolving the promise.
const getEngine = async function () {
  if ( cache.engine == null ) {
    cache.engine = FeedEngine.create();
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

const reset = async function () {
  const engine = await getEngine();
  await engine.reset();

  cache = {
    feed: [],
    scrollPosition: 0,
    engine
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