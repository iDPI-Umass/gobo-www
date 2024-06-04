import * as Value from "@dashkite/joy/value";

const extract = ( platform, draft ) => {
  const thread = [];
  for ( const row of draft.thread ) {
    const item = row.find( i => i.platform === platform );
    if ( item != null ) {
      thread.push( item );
    } else {
      break;
    }
  }

  return Value.clone( thread );
};


export {
  extract
}