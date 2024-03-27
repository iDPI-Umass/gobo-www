import { Gobo, App } from "$lib/engines/account.js";


const get = App.unauthorized( async function ( name ) {  
  try {
    const client = await Gobo.get();
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

const put = App.unauthorized( async function ( name, content ) {
  const client = await Gobo.get();
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