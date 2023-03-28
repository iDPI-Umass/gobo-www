import { getGOBOClient } from "$lib/helpers/account";


const categorize = function ( keyword ) {
  keyword.key = `${ keyword.category }:${ keyword.word }`;
  keyword.active = false;
};

const sort = function ( keywords ) {
  for ( const keyword of keywords ) {
    categorize( keyword );
  }

  return keywords.sort( function ( A, B ) {
    if ( A.key < B.key ) {
      return -1;
    } else {
      return 1;
    }
  });
}

const list = async function () {
  const client = await getGOBOClient();
  const result = await client.getBlockedKeywords();
  return sort( result.keywords );
};

const add = async function ( keyword ) {
  const client = await getGOBOClient();
  await client.addBlockedKeyword({
    parameters: { 
      category: keyword.category, 
      word: keyword.word
    }
  });
  return keyword;
};

const remove = async function ( keyword ) {
  const client = await getGOBOClient();
  await client.deleteBlockedKeyword({
    parameters: {
      category: keyword.category,
      word: keyword.word
    }
  });
}

export {
  list,
  sort,
  add,
  remove
}