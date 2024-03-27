import { Gobo, App } from "$lib/engines/account.js";


const put = async function ({ identity, post, name }) {
  const client = await Gobo.get();
  let edge;
  try {
    edge = await client.personPostEdge.put({ 
      person_id: client.id,
      identity_id: identity,
      post_id: post,
      name
    });
  } catch ( error ) {
    if ( error.status === 401 ) {
      await App.logout();
      return {};
    } else {
      throw error;
    }
  }

  return edge;
}

const remove = async function ({ identity, post, name }) {
  const client = await Gobo.get();
  try {
    await client.personPostEdge.delete({
      person_id: client.id,
      identity_id: identity,
      post_id: post,
      name
    });
  } catch ( error ) {
    if ( error.status === 401 ) {
      await App.logout();
      return {};
    } else {
      throw error;
    }
  }
}


export {
  put,
  remove
}