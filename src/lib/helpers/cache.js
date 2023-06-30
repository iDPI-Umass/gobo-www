const cache = new Map();

const setTTL = function ( ttl ) {
  const date = new Date();
  date.setUTCSeconds( date.getUTCSeconds() + ttl );
  return date.toISOString();
};

export const read = function ( key ) {
  return cache.get( key );
};

export const write = function ( key, ttl, value ) {
  const entry = {
    expires: setTTL( ttl ),
    value: value
  }

  cache.set( key, entry );
  return entry;
};

export const remove = function ( key ) {
  cache.delete( key );
}