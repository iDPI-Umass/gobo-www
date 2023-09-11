import * as Store from "$lib/resources/store.js";


const get = async function () {
  let store = await Store.get( "welcome" );
  return store?.content;
};

const put = async function () {
  await Store.put( "welcome", { created: ( new Date ).toISOString() } );
}


export {
  get,
  put
}