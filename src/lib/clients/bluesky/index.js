class Bluesky {
  ORIGIN = "https://public.api.bsky.app";

  // We only need to supply the identity here if we want to access a protected
  // resource from Bluesky's API. The typeahead endpoint is currently not one of them.
  constructor( identity ) {
    this.identity = identity;
    this.token = undefined;
  }

  static make( identity ) {
    return new Bluesky( identity );
  }

  async _get( url, headers = {}, overrides ) {
    const options = {
      method: "GET", 
      headers,
      ...overrides
    };
  
    const response = await fetch( url, options );
    if ( response.status !== 200 ) {
      console.error( await response.text() );
      throw new Error( `unexpected response status ${response.status} from Bluesky`)
    }
  
    const contentType = response.headers.get("content-type");
  
    if ( /application\/json/i.test( contentType )) {
      return response.json();
    } else {
      return response.text();
    }
  }

  async get( url, headers = {} ) {
    if ( !headers.authorization && this.token ) {
      headers.authorization = `Bearer ${this.token}`
    }

    return this._get( url, headers );
  }


  async getAccountSuggestions( string ) {
    if ( !string ) {
      return { actors: [] };
    }
  
    const path = "/xrpc/app.bsky.actor.searchActorsTypeahead";
    const url = new URL( path, this.ORIGIN );
    url.searchParams.set( "q", string );
    url.searchParams.set( "limit", 10 );
  
    const headers = {
      accept: "application/json"
    };
  
    return this.get( url, headers );
  }

  async resolveHandle( handle ) {
    if ( !handle ) {
      return;
    }

    const path = '/xrpc/com.atproto.identity.resolveHandle'
    const url = new URL( path, this.ORIGIN );
    url.searchParams.set( "handle", handle );

    const headers = {
      accept: "application/json"
    };

    // We're getting an error stating that CORS headers are not set on this
    // resource. So we need to put fetch into a different mode to successfully
    // retrieve the DID for this account.
    const overrides = {
      mode: 'no-cors'
    };

    return this.get( url, headers, overrides );
  }
}


export {
  Bluesky
}