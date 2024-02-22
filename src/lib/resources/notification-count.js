import { getGOBOClient, handleUnauthorized } from "$lib/helpers/account.js";


const get = handleUnauthorized( async function () {
  const client = await getGOBOClient();
  return await client.personNotificationCount.get({ 
    person_id: client.id
  });
});


const put = handleUnauthorized( async function ( count = 0 ) {
  const client = await getGOBOClient();
  return await client.personNotificationCount.put({ 
    person_id: client.id,
    count
  });
});


export { get, put }