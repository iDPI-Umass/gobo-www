import { getGOBOClient, handleUnauthorized } from "$lib/helpers/account.js";


const getPrettyName = function ( identity ) {
  let hostname;
  const { username, platform, base_url } = identity;

  switch ( platform ) {
    case "bluesky":
      return `@${ username }`;
    case "reddit":
      return `u/${ username }`;
    case "mastodon":
    case "smalltown":
      // We just want the hostname to form a fully specified Mastodon reference.
      if ( base_url.startsWith( "https://" ) === true ) {
        let url = new URL( base_url );
        hostname = url.hostname;
      } else {
        hostname = base_url;
      }      
      return `@${ username }@${ hostname }`;
  }
};

const categorize = function ( identity ) {
  identity.key = String( identity.id );
  identity.active = true;
  identity.prettyName = getPrettyName( identity );
  return identity;  
};


const sort = function ( identities ) {
  let blueskys = [];
  let mastodons = [];
  let reddits = [];
  let smalltowns = [];

  for ( let identity of identities ) {
    identity = categorize( identity ); 

    if ( identity.platform === "bluesky" ) {
      blueskys.push( identity );
    } else if ( identity.platform === "reddit" ) {
      reddits.push( identity );
    } else if ( identity.platform === "mastodon" ) {
      mastodons.push( identity );
    } else if ( identity.platform === "smalltown" ) {
      smalltowns.push( identity );
    }
  }

  return [ ...blueskys, ...mastodons, ...reddits, ...smalltowns ];
};

const list = handleUnauthorized( async function () {  
  try {
    const client = await getGOBOClient();
    const identities = await client.personIdentities.get({ 
      person_id: client.id
    });
    return sort( identities );
  } catch ( error ) {
    console.error( error );
    return [];
  }
});

const remove = handleUnauthorized( async function ( identity ) {
  const client = await getGOBOClient();
  await client.personIdentity.delete( identity );
});



export {
  list,
  remove
}