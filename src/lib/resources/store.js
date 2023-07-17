import { getGOBOClient, handleUnauthorized } from "$lib/helpers/account.js";


const get = handleUnauthorized( async function ( name ) {  
  try {
    const client = await getGOBOClient();
    const store = await client.personStore.get({ 
      person_id: client.id,
      name: name
    });
    return store;
  
  } catch ( error ) {
    if ( error.status === 404 ) {
      return null;
    } else {
      throw error;
    }
  }
});

const put = handleUnauthorized( async function ( name, content ) {
  const client = await getGOBOClient();
  const store = await client.personStore.put({
    person_id: client.id,
    name: name,
    content: content
  });
  return store;
});


export {
  get,
  put
}