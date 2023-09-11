import { getGOBOClient, logout } from "$lib/helpers/account";


const put = async function ({ identity, post, name }) {
  const client = await getGOBOClient();
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
      await logout();
      return {};
    } else {
      throw error;
    }
  }

  return edge;
}

const remove = async function ({ identity, post, name }) {
  const client = await getGOBOClient();
  try {
    await client.personPostEdge.delete({
      person_id: client.id,
      identity_id: identity,
      post_id: post,
      name
    });
  } catch ( error ) {
    if ( error.status === 401 ) {
      await logout();
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