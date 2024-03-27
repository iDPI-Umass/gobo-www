import { Gobo, App } from "$lib/engines/account.js";


const list = App.unauthorized( async function ( options ) {
  const client = await Gobo.get();
  return await client.personNotifications.get({ 
    person_id: client.id,
    id: options.id,
    per_page: options.per_page,
    start: options.start,
    view: options.view
  });
});


export { list }