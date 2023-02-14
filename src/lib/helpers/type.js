const isImage = function ( file ) {
  if ( ( file == null ) || ( file.type == null ) ) {
    return false;
  }

  return /^image/.test( file.type );
};

const isVideo = function ( file ) {
  if ( ( file == null ) || ( file.type == null ) ) {
    return false;
  }

  return /^video/.test( file.type );
};

export {
  isImage,
  isVideo
}