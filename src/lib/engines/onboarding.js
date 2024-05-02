import * as LS from "$lib/helpers/local-storage.js";
import { Gobo } from "$lib/engines/account.js";

const Onboard = {};

Onboard.stow = ( context ) => {
  LS.write( "gobo-platform", context.platform );
  LS.write( "gobo-baseURL", context.baseURL );
  LS.write( "gobo-bluesky-login", context.blueskyLogin );
  LS.write( "gobo-bluesky-secret", context.blueskySecret );
};

Onboard.start = async ( context ) => {
  const client = await Gobo.get();
  let result;

  try {
    result = await client.actionOnboardIdentityStart.post({ 
      content: {
        platform: context.platform,
        base_url: context.baseURL
      }
    });
  } catch ( error ) {
    console.error( error );
    return;
  }
  
  console.log( result );
  context.onboard = result;
  return context;
};

Onboard.makeLoginURL = ( context ) => {
  if ( context.platform === "bluesky" ) {
    // For Bluesky, we handle the app password flow differently than OAuth.      
    return `/add-identity-callback?state=${ context.onboard.state }`;
  }
  
  // Default
  return context.onboard.redirect_url;
};


export {
  Onboard
}