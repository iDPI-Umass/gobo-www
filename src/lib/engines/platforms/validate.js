import { Draft } from "$lib/engines/draft.js";
import { Bluesky } from "$lib/engines/platforms/bluesky.js";
import { Linkedin } from "$lib/engines/platforms/linkedin.js";
import { Mastodon } from "$lib/engines/platforms/mastodon.js";
import { Reddit } from "$lib/engines/platforms/reddit.js";
import { Smalltown } from "$lib/engines/platforms/smalltown.js";


const Validate = {};

Validate.isValid = () => {
  const draft = Draft.read();
  console.log( "validating", draft );

  const tests = [
    Validate.active,
    Bluesky.validate,
    Linkedin.validate,
    Mastodon.validate,
    Reddit.validate,
    Smalltown.validate,
  ];

  const results = [];
  for ( const test of tests ) {
    results.push( test( draft ));
  }
  return results.every( result => result === true );
};


Validate.active = () => {
  const draft = Draft.read();
  
  const actives = draft.identities.filter( i => i.active === true );
  if ( actives.length === 0 ) {
    Draft.pushAlert( "You must select an identity to publish this post." );
    return false;
  }
  
  const stales = actives.filter( i => i.stale === true );
  if ( stales.length > 0 ) {
    Draft.pushAlert( "One of the selected identities has a lapsed integration and cannot be used publish." );
    return false;
  }

  const reddits = actives.filter( i => i.platform === "reddit" );
  if ( reddits.length > 1 ) {
    Draft.pushAlert( "You may only publish with on Reddit identity at a time." );
    return false;    
  }
  
  return true;
};

export {
  Validate
}