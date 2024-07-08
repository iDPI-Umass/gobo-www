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

const unroll = ( draft ) => {
  const platforms = [];
  for ( const item of draft.thread[0] ?? []) {
    platforms.push( item.platform );
  }

  const chunks = {};
  for ( const row of draft.thread ) {
    for ( const item of row ) {
      const platform = item.platform;
      chunks[ platform ] ??= [];
      chunks[ platform ].push( item );
    }
  }

  const result = [];
  for ( const platform of platforms ) {
    result.push( ...chunks[ platform ] );
  }

  return Value.clone( result );
};


export {
  extract,
  unroll
}