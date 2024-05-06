import { Gobo, App } from "$lib/engines/account.js";


const get = App.unauthorized(async ({ identity, id }) => {
  const client = await Gobo.get();
  return await client.personIdentityPost.get({ 
    person_id: client.id,
    identity_id: identity,
    id 
  });
});



const publish = App.unauthorized(async ( post, targets ) => {
  console.log("simulation post creation")
  // const client = await Gobo.get();
  // await client.personPosts.post({ 
  //   parameters: { person_id: client.id },
  //   content: { post, targets }   
  // });
});


export {
  get,
  publish
}