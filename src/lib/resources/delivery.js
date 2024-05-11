import { Gobo, App } from "$lib/engines/account.js";


const get = App.unauthorized(async ({ id }) => {
  const client = await Gobo.get();
  return await client.personDelivery.get({ 
    person_id: client.id,
    id 
  });
});


export {
  get
}