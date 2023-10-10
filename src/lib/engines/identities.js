import * as Identity from "$lib/resources/identity.js";

/***
This application is concerned with constructing a composite feed out of posts
emanating from identities. We need configuration that controls that composition.
In this case, we'd like to track which identities the GOBO member is actively
viewing in their feed. That "active" state is related to the personIdentity 
resource, but it stands apart. We'd also like to that value to persist
beyond even local storage. Therefore, we're talking about a new HTTP resource.

And to avoid consensus issues, we actually need several, fine-grained resources
that we can compose. Right now we're getting away with an extra field attached
to the identity resource. But as the concept matures or there are more options,
we'll want to break that out. The engine below handles the tedious parts of that.
And makes it easier to replace the implementation in the future.
 ***/

class IdentityEngine {
  constructor ({ identities }) {
    this.identities = identities;
  }

  static async create () {
    const identities = await Identity.list();
    return new IdentityEngine({ identities });
  }

  getActiveIdentities () {
    const active = [];
    for ( const identity of this.identities ) {
      if ( identity.active === true ) {
        active.push( identity );
      }
    }
    return active;
  };
  
  async refreshIdentities () {
    this.identities = await Identity.list();
  };
  
  setActiveState ( identity, active ) {
    const match = this.identities.find( i => i.id === identity.id );
    if ( match == null ) {
      throw Error(`did not find match for identity ${identity.id}`);
    }
    match.active = active;
    Identity.setActiveState( match, active );
  };
}

export {
  IdentityEngine
}