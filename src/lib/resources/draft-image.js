import { getGOBOClient, logout } from "$lib/helpers/account";


const create = async function ({ file, alt }) {
  const form = new FormData();
  form.append("image", file, { filename: file.name });
  form.append("name", file.name );
  form.append("alt", alt );
  
  try {
    const client = await getGOBOClient();
    return await client.personDraftImages.post({
      parameters: { person_id: client.id },
      content: form,
    });

  } catch ( error ) {
    if ( error.status === 401 ) {
      return await logout();
    }
  }
};


const remove = async function ( draft ) {
  try {
    const client = await getGOBOClient();
    return await client.personDraftImage.delete({
      person_id: client.id,
      id: draft.id
    });
  } catch ( error ) {
    if ( error.status === 401 ) {
      return await logout();
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