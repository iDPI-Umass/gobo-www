import { parseTemplate } from 'url-template';
import * as Type from "@dashkite/joy/type";
import { PUBLIC_GOBO_API } from '$env/static/public';


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
      contentType: "text/plain",
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
    template: "/remove-identity{?base_url,identity_id}",
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
  },
  getBlockedKeywords: {
    template: "/blocked-keywords",
    request: {
      method: "GET"
    },
    response: {
      contentType: "application/json",
      status: 200
    }
  },
  addBlockedKeyword: {
    template: "/blocked-keywords{?word,category}",
    request: {
      method: "POST",
      contentType: "application/json"
    },
    response: {
      contentType: "application/json",
      status: 200
    }
  },
  deleteBlockedKeyword: {
    template: "/blocked-keywords{?word,category}",
    request: {
      method: "DELETE",
    },
    response: {
      status: 200
    }
  },
  getProfile: {
    template: "/user-profile",
    request: {
      method: "GET",
      contentType: "application/json"
    },
    response: {
      status: 200,
      contentType: "application/json"
    }
  },
  updateProfile: {
    template: "/user-profile{?display_name}",
    request: {
      method: "PUT",
      contentType: "application/json"
    },
    response: {
      status: 200,
      contentType: "application/json"
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
    console.log( "GOBO Request:", name, parameters );

    // Determine URL
    const template = parseTemplate( action.template );
    const url = PUBLIC_GOBO_API + template.expand( parameters );


    // Prepare request configuration
    const options = {
      method: action.request.method,
      mode: "cors",
      redirect: "follow",
      headers: {
        Authorization: `Bearer ${ account.token.access_token }`,
        "Content-Security-Policy": `default-src ${ PUBLIC_GOBO_API }`
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
    let value;
    let type = response.headers.get( "Content-Type" );
    
    if ( response.status === 204 ) {
      value = undefined;
    } else if ( type === "application/json" ) {
      value = await response.json();
    } else if ( /text/i.test( type ) ) {
      value = await response.text();
    }

    // All done.
    return value;
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