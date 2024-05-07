import { Gobo, App } from "$lib/engines/account.js";


const create = async function ({ file, name, alt }) {
  const form = new FormData();
  const filename = name ?? file.name;
  form.append("file", file, { filename });
  form.append("name", filename );
  if ( file.type != null && file.type !== "" ) {
    form.append("mime_type", file.type );
  } 
  if ( alt != null && alt !== "" ) {
    form.append("alt", alt );
  }
  
  try {
    const client = await Gobo.get();
    return await client.personDraftFiles.post({
      parameters: { person_id: client.id },
      content: form,
    });

  } catch ( error ) {
    if ( error.status === 401 ) {
      return await App.logout();
    }
    throw error;
  }
};


const remove = async function ( draft ) {
  try {
    const client = await Gobo.get();
    return await client.personDraftFile.delete({
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