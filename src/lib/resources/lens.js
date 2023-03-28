import { getGOBOClient } from "$lib/helpers/account";


const categorize = function ( lens ) {
  lens.key = `${ lens.type }:${ lens.name }`;
  lens.active = true;
};

const sort = function ( lenses ) {
  for ( const lens of lenses ) {
    categorize( lens );
  }

  return lenses.sort( function ( A, B ) {
    if ( A.key < B.key ) {
      return -1;
    } else {
      return 1;
    }
  });
}

// TODO: There's not currently an HTTP resource associated with lenses, but
//   it's presence is strongly implied, so I'm going to pretend that it follows
//   the pattern of the others for maintaining state.
const list = async function () {
  // const client = await getGOBOClient();
  // const result = await client.getBlockedKeywords();

  const lenses = [{
    type: "default",
    name: "keyword blocking",
    description: "Words and phrases you would like to exclude from your GOBO feed",
    active: false
  }];

  return sort( lenses );
};

export {
  list
}