import { getGOBOClient } from "$lib/helpers/account.js";

const handleError = function ( f ) {
  return async function ( ...args ) {
    try {
      return await f( ...args );
    } catch ( error ) {
      console.error( error );
      return { count: 0 };
    }
  }
};

const get = handleError(async function () {
  const client = await getGOBOClient();
  return await client.personNotificationCount.get({ 
    person_id: client.id
  });
});


const put = handleError( async function ( count = 0 ) {
  const client = await getGOBOClient();
  return await client.personNotificationCount.put({ 
    person_id: client.id,
    count
  });
});


export { get, put }