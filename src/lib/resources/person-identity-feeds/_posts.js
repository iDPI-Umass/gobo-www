import { getGOBOClient, handleUnauthorized } from "$lib/helpers/account.js";


const list = handleUnauthorized( async function ( options ) {
  const client = await getGOBOClient();
  return await client.personIdentityFeed.get({ 
    person_id: client.id,
    id: options.id,
    per_page: options.per_page,
    start: options.start
  });
});


export { list }