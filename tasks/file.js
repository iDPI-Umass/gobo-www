import * as FS from "./fs.js";

const read = async function ( root ) {
  const files = await FS.glob( "**/*", root );

  for ( const file of files ) {
    await FS.readBinary( file );
    FS.hash( file );
  }

  return files;
};

export {
  read
}