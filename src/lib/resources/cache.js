const cache = {
  posts: {},
  sources: {}
};

class Cache {
  static getPost ( id ) {
    return cache.posts[ id ];
  }

  static getSource ( id ) {
    return cache.sources[ id ];
  }
}

export {
  cache,
  Cache
}