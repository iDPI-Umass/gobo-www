import chalk from "chalk";

const getFlag = ( name, config ) => {
  const value = config.args[ name ];
  if ( value == null ) {
    throw new Error( `command flag \"${ name }\" is not set.` );
  }
  return value;
};

const log = (...messages) => {
  let string = chalk.magenta( '[ idpi ]' );
  for ( const message of messages ) {
    string += chalk.cyan( ` ${message}` );
  }
  console.log( string );
};

const logError =(...messages) => {
  let string = chalk.magenta( '[ idpi ]' );
  for ( const message of messages ) {
    string += chalk.red( ` ${message}` );
  }
  console.error( string );
};

export {
  getFlag,
  log,
  logError,
}