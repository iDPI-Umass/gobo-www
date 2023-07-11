import { getGOBOClient } from "$lib/helpers/account";


const label = function ( lens ) {
  const { type, value } = lens.configuration;
  lens.key = `${ type }:${ value }`;
};

const sort = function ( lenses ) {
  for ( const lens of lenses ) {
    label( lens );
  }

  lenses.sort( function ( A, B ) {
    if ( A.key < B.key ) {
      return -1;
    } else {
      return 1;
    }
  });

  return lenses;
}

const pullLenses = async function () {
  const client = await getGOBOClient();

  const lenses = [];
  let page = 1;
  let per_page = 100;
  while ( true ) {
    let results = await client.personLenses.get({ 
      person_id: client.id,
      page,
      per_page
    });

    lenses.push( ...results );
    page += 1;

    if ( results.length != per_page ) {
      break;
    }
  }

  return lenses;
};

const listBlocks = async function () {
  let blocks = ( await pullLenses() )
    .filter( l => l.category === "block" );
  
  return sort( blocks );
};

const addBlock = async function ( configuration ) {
  const client = await getGOBOClient();
  const block = await client.personLenses.post({
    parameters: {
      person_id: client.id
    },
    content: {
      person_id: client.id,
      category: "block",
      active: true,
      configuration
    }
  });
  return block;
};

const removeBlock = async function ( block ) {
  const client = await getGOBOClient();
  await client.personLens.delete({
    person_id: client.id,
    id: block.id
  });
  return null;
}


export {
  sort,
  listBlocks,
  addBlock,
  removeBlock
}