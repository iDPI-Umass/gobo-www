import { Gobo, App } from "$lib/engines/account.js";


const create = App.unauthorized(async ( kernel ) => {
  const client = await Gobo.get();
  kernel.person_id ??= client.id;
  return await client.personProofs.post({
    parameters: { person_id: client.id },
    content: kernel,
  });
});


const remove = App.unauthorized(async ( proof ) => {
  const client = await Gobo.get();
  return await client.personProof.delete({
    person_id: client.id,
    id: proof.id
  });
});

const update = App.unauthorized(async ( proof ) => {
  const client = await Gobo.get();
  return await client.personProof.putt({
    parameters: { 
      person_id: client.id,
      id: proof.id
    },
    content: proof,
  });
});


export {
  create,
  remove,
  update
}