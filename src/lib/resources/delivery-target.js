import { Gobo, App } from "$lib/engines/account.js";

const unpublish = App.unauthorized(async ({ person_id, id }) => {
  const client = await Gobo.get();
  return await client.personDeliveryTarget.post({
    parameters: { person_id, id },
    content: {
      action: "unpublish"
    }
  });
});


export {
  unpublish
}