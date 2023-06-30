import { getGOBOClient, getProfile } from "$lib/helpers/account.js";


const getType = function ( identity ) {
  switch ( identity.base_url ) {
    case "https://twitter.com":
      return "twitter";
    case "https://www.reddit.com":
      return "reddit";
    default:
      return "mastodon"; 
  }
}

const getPrettyName = function ( identity ) {
  let hostname;
  const { username, type, base_url } = identity;

  switch ( type ) {
    case "twitter":
      return `@${ username }`;
    case "reddit":
      return `u/${ username }`;
    case "mastodon":
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
  identity.key = identity.id;
  identity.active = true;
  identity.type = getType( identity );
  identity.prettyName = getPrettyName( identity );
  return identity;  
};


const sort = function ( identities ) {
  let mastodons = [];
  let reddits = [];
  let twitters = [];

  for ( let identity of identities ) {
    identity = categorize( identity ); 

    if ( identity.type === "twitter" ) {
      twitters.push( identity );
    } else if ( identity.type === "reddit" ) {
      reddits.push( identity );
    } else if ( identity.type === "mastodon" ) {
      mastodons.push( identity );
    }
  }

  return [ ...mastodons, ...reddits, ...twitters ];
};

const list = async function () {  
  try {
    const client = await getGOBOClient();
    const profile = await getProfile();
    const identities = await client.personIdentities.get({ 
      person_id: profile.id
    });
    return sort( identities );
  } catch ( error ) {
    console.error( error );
    return [];
  }
};

const remove = async function ( identity ) {
  const client = await getGOBOClient();
  await client.personIdentity.delete( identity );
};



export {
  list,
  remove
}