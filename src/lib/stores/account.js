import { auth } from "$lib/stores/auth.js";
import { buildClient as buildGOBOClient } from "$lib/helpers/gobo.js";

let account, data, goboClient;
let change = false;
let firstPass;
let initialization = new Promise( function (resolve) {
  firstPass = resolve;
});

auth.subscribe( async function( _data ) {
  data = _data;
  change = true;
  firstPass();
});

const getAccount = async function() {
  console.log("starting get account");
  await initialization;
  console.log("resolved initialization");

  if ( change === true ) {
    console.log("refreshing account data");
    const authClient = await data.client;
    account = await authClient.getUser();
    account.token = await authClient.getTokenSilently({
      detailedResponse: true
    });
    change = false;
  }

  return account;
}

const getGOBO = async function () {
  const _account = await getAccount();
  goboClient = buildGOBOClient({ account: _account });
  return goboClient;
}

export { getAccount, getGOBO }



