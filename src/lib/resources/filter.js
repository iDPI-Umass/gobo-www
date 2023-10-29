import { getGOBOClient, handleUnauthorized } from "$lib/helpers/account";


const label = function ( filter ) {
  const { type, value } = filter.configuration;
  filter.key = `${ type }:${ value }`;
};

const sort = function ( filters ) {
  for ( const filter of filters ) {
    label( filter );
  }

  filters.sort( function ( A, B ) {
    if ( A.key < B.key ) {
      return -1;
    } else {
      return 1;
    }
  });

  return filters;
}

const list = handleUnauthorized( async function () {
  const client = await getGOBOClient();

  const filters = [];
  let page = 1;
  let per_page = 100;
  while ( true ) {
    let results = await client.personFilters.get({ 
      person_id: client.id,
      page,
      per_page
    });

    filters.push( ...results );
    page += 1;

    if ( results.length != per_page ) {
      break;
    }
  }

  return filters;
});


const add = handleUnauthorized( async function ( category, configuration ) {
  const client = await getGOBOClient();
  const filter = await client.personFilters.post({
    parameters: {
      person_id: client.id
    },
    content: {
      person_id: client.id,
      category,
      active: true,
      configuration
    }
  });
  return filter;
});

const update = handleUnauthorized( async function ( filter ) {
  const client = await getGOBOClient();
  filter = await client.personFilter.put( filter ); 
  return filter;
}); 

const remove = handleUnauthorized( async function ( filter ) {
  const client = await getGOBOClient();
  await client.personFilter.delete({
    person_id: client.id,
    id: filter.id
  });
  return null;
});


export {
  list,
  add,
  update,
  remove
}