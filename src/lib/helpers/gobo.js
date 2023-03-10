import { PUBLIC_GOBO_API } from '$env/static/public';
import { parseTemplate } from 'url-template';
import * as Type from "@dashkite/joy/type";

const actions = {
  addIdentity: {
    template: "/add-identity{?base_url}",
    request: {
      method: "GET"
    },
    response: {
      contentType: "application/json",
      status: 200
    }
  },
  addIdentityCallback: {
    template: "/add-identity{?base_url,oauth_token,oauth_verifier,code,state}",
    request: {
      method: "POST"
    },
    response: {
      contentType: "application/json",
      status: 201
    }
  },
  identityInfo: {
    template: "/identity-info",
    request: {
      method: "GET"
    },
    response: {
      contentType: "application/json",
      status: 200
    }
  },
  removeIdentity: {
    template: "/remove-identity{?base_url,id}",
    request: {
      method: "DELETE"
    },
    response: {
      status: 200
    }
  },
  freshFeed: {
    template: "/fresh-feed",
    request: {
      method: "GET"
    },
    response: {
      contentType: "application/json",
      status: 200
    }
  }

  // Page is not yet implmented
  // page: {
  //   template: "/page"
  // },
  
  // Create Post is not yet implemented
  // createPost: {
  //   template: "/create-post",
  //   request: {
  //     method: "POST"
  //   }
  // }
};


class GOBOError extends Error {
  constructor( response ) {
    super();
    this.name = "GOBOError";
    this.response = response;
    this.status = response.status;
  }
}


const buildAction = function ( name, account ) {
  // Actions configure what this HTTP request should do.
  const action = actions[ name ];

  return async function ({ parameters={}, body } = {}) {
    console.log( "requesting...", name, parameters );

    // Determine URL
    const template = parseTemplate( action.template );
    const url = PUBLIC_GOBO_API + template.expand( parameters );


    // Prepare request configuration
    const options = {
      method: action.request.method,
      mode: "cors",
      redirect: "follow",
      headers: {
        Authorization: `Bearer ${ account.token.access_token }`
      }
    };


    if ( action.request.contentType != null ) {
      options.headers[ "Content-Type" ] = action.request.contentType;
    }

    if ( action.response.contentType != null ) {
      options.headers.Accept = action.response.contentType;
    }

    if ( body != null ) {
      if ( Type.isObject( body )) {
        options.body = JSON.stringify( body );
      } else {
        options.body = body;
      }
    }


    // Issue request
    console.log(url, options);
    const response = await fetch( url, options );
    
    // Validate response status.
    if ( response.status !== action.response.status ) {
      throw new GOBOError( response );
    }

    // Extract response body.
    let json;
    if ( action.response.contentType === "application/json" ) {
      json = await response.json();
    }

    // All done.
    return json;
  };
};


const buildGOBOClient = function ({ account }) {
  const client = {};
  for ( const name in actions ) {
    client[ name ] = buildAction( name, account );
  }
  return client;
};

export { 
  GOBOError,
  buildGOBOClient
}