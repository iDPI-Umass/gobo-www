const elide = function ( length, string ) {
  if ( string == null || string.length <= length ) {
    return string;
  } else {
    return string.slice( 0, length ) + "…";
  }
}

export {
  elide
}