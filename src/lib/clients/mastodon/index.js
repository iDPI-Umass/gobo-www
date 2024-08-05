class Mastodon {
  constructor( identity ) {
    this.identity = identity;
    this.ORIGIN = identity.base_url;
    this.token = identity.oauth_token;
  }

  static create( identity ) {
    return new Mastodon( identity );
  }

  async _get( url, headers = {} ) {
    const options = {
      method: "GET", 
      headers
    }
  
    const response = await fetch( url, options );
    if ( response.status !== 200 ) {
      console.error( await response.text() );
      throw new Error( `unexpected response status ${response.status} from Mastodon ${this.ORIGIN}`)
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
      return [];
    }
  
    const path = "/api/v1/accounts/search";
    const url = new URL( path, this.ORIGIN );
    url.searchParams.set( "q", string );
    url.searchParams.set( "limit", 10 );
  
    const headers = {
      accept: "application/json"
    };
  
    return this.get( url, headers );
  }
}


export {
  Mastodon
}