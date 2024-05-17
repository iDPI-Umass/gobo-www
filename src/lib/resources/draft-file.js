import { Gobo, App } from "$lib/engines/account.js";


const create = App.unauthorized(async ( kernel ) => {
  const client = await Gobo.get();
  return await client.personDraftFiles.post({
    parameters: { person_id: client.id }
  });
});


const remove = App.unauthorized(async ( file ) => {
  const client = await Gobo.get();
  return await client.personDraftFile.delete({
    person_id: client.id,
    id: file.id
  });
});


const update = App.unauthorized(async ( file ) => { 
  const client = await Gobo.get();
  return await client.personDraftFile.put({
    parameters: { 
      person_id: client.id,
      id: file.id 
    },
    content: file,
  });
});

const upload = App.unauthorized(async ({ file, name, alt, id }) => {
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
  
  const client = await Gobo.get();
  return await client.personDraftFile.post({
    parameters: { 
      person_id: client.id,
      id 
    },
    content: form,
  });
});


export {
  create,
  remove,
  update,
  upload
}