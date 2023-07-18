import { FeedEngine } from "$lib/helpers/feed.js";

let cache = {
  feed: [],
  scrollPosition: 0
};

const reset = async function () {
  cache = {
    feed: [],
    scrollPosition: 0,
    engine: await FeedEngine.create()
  };
}

const getEngine = async function () {
  if ( cache.engine == null ) {
    cache.engine = await FeedEngine.create(); 
  }

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

export {
  reset,
  getEngine,
  setEngine,
  getFeed,
  setFeed,
  getScrollPosition,
  setScrollPosition,
}