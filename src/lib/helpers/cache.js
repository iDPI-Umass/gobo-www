const cache = {};

const setTTL = function ( ttl ) {
  const date = new Date();
  date.setUTCSeconds( date.getUTCSeconds() + ttl );
  return date.toISOString();
};

export const read = function ( key ) {
  return cache[ key ];
};

export const write = function ( key, ttl, value ) {
  cache[ key ] = {
    expires: setTTL( ttl ),
    value: value
  };
};

export const remove = function ( key ) {
  delete cache[ key ]
}