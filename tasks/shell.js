import Child, { spawn } from "node:child_process";


const run = function ( command ) {
  const [ main, ...args ] = command.split( /\s+/ );

  return new Promise( function ( resolve ) {
    const spawnObject = Child.spawn( main, args );

    spawnObject.stdout.on( "data", function ( data ) {
      console.log( data.toString( "utf8" ) );
    });
    
    spawnObject.stderr.on( "data", function ( data ) {
      console.log( data.toString( "utf8" ) );
    });
    
    spawnObject.on( "close", function ( code ) {
      resolve( code );
    });
  });
};

export {
  run
}
