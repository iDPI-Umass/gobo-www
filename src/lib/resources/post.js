import { getGOBOClient, handleUnauthorized } from "$lib/helpers/account";


const get = handleUnauthorized(async ({ identity, id }) => {
  const client = await getGOBOClient();
  return await client.personIdentityPost.get({ 
    person_id: client.id,
    identity_id: identity,
    id 
  });
});



const publish = handleUnauthorized(async ( post, targets ) => {
  const client = await getGOBOClient();
  await client.personPosts.post({ 
    parameters: { person_id: client.id },
    content: { post, targets }   
  });
});


export {
  get,
  publish
}