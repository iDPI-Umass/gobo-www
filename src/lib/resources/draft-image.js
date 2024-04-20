import { Gobo, App } from "$lib/engines/account.js";


const create = async function ({ file, name, alt }) {
  const form = new FormData();
  form.append("image", file, { filename: name ?? file.name });
  form.append("name", name ?? file.name );
  form.append("alt", alt );
  
  try {
    const client = await Gobo.get();
    return await client.personDraftImages.post({
      parameters: { person_id: client.id },
      content: form,
    });

  } catch ( error ) {
    if ( error.status === 401 ) {
      return await App.logout();
    }
  }
};


const remove = async function ( draft ) {
  try {
    const client = await Gobo.get();
    return await client.personDraftImage.delete({
      person_id: client.id,
      id: draft.id
    });
  } catch ( error ) {
    if ( error.status === 401 ) {
      return await App.logout();
    }
    if ( error.status === 404 ) {
      console.warn( `The draft image ${ draft.id } is not found` );
    }
  }
};


export {
  create,
  remove
}