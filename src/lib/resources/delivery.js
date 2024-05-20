import { Gobo, App } from "$lib/engines/account.js";

const create = App.unauthorized(async ( kernel ) => {
  const client = await Gobo.get();
  return await client.personDeliveries.post({
    parameters: {
      person_id: client.id, 
    },
    content: kernel
  });
});

const get = App.unauthorized(async ({ id }) => {
  const client = await Gobo.get();
  return await client.personDelivery.get({ 
    person_id: client.id,
    id 
  });
});

const unpublish = App.unauthorized(async ({ person_id, id }) => {
  const client = await Gobo.get();
  return await client.personDelivery.post({
    parameters: { person_id, id },
    content: {
      action: "unpublish"
    }
  });
});


export {
  create,
  get,
  unpublish
}