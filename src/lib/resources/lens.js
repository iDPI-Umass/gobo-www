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


const list = async function () {
  const client = await getGOBOClient();
  const results = await client.personLenses.get({ person_id: client.id });
  console.log({results});

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