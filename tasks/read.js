import * as FS from "./fs.js";

const getLocalFiles = async function () {
  const root = "build";
  const files = await FS.glob( "**/*", root );

  for ( const file of files ) {
    await FS.readBinary( file );
    FS.hash( file );
  }

  return files;
};

export {
  getLocalFiles
}