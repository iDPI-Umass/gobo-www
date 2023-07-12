const cache = new Map();

const setTTL = function ( ttl ) {
  const date = new Date();
  date.setUTCSeconds( date.getUTCSeconds() + ttl );
  return date.toISOString();
};

const read = function ( key ) {
  const match = cache.get( key );
  const now = (new Date).toISOString();

  if ( match == null || match.expires < now ) {
    return null;
  } else {
    return match;
  }
};

const write = function ( key, ttl, value ) {
  const entry = {
    expires: setTTL( ttl ),
    value: value
  }

  cache.set( key, entry );
  return entry;
};

const remove = function ( key ) {
  cache.delete( key );
}

export {
  read,
  write,
  remove
}