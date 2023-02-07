import { writable } from "svelte/store";
import { browser } from "$app/environment";
import * as LS from "$lib/stores/local-storage.js";
import * as Type from "@dashkite/joy/type";


const buildKey = function ({ platform, account}) {
  return `${platform}::${account}`;
}

const isFile = function ( value ) {
  if ( browser ) {
    return Type.isType( File, value );
  } else {
    return false;
  }
}

const emptyDraft = function () {
  return {
    identities: {},
    files: [],
    options: {
      sensitive: false,
      visibility: "public",
      spoilerText: null,
      title: null,
      subreddit: null
    },
    content: null
  };
}

const createDraft = function () {
  let draft;

  if ( browser ) {
    draft = LS.read( "gobo-draft" );
  }

  if ( draft == null ) {
    draft = emptyDraft();
  }

  const { subscribe, update } = writable( draft );

  const write = function ( data ) {
    LS.write( "gobo-draft", data );
    // console.log(data);
    return data;
  };
  
  return {
    subscribe,
    buildKey: buildKey,
    isFile: isFile,
    clear: function () {
      update( function () {
        return emptyDraft();
      });
    },
    update: function ( data ) {
      update( function ( draft ) {
        Object.assign( draft, data );
        return write( draft );
      });
    },
    updateIdentity: function ( data ) {
      update( function ( draft ) {
        Object.assign( draft.identities, data );
        return write( draft );
      });
    },
    updateOption: function ( data ) {
      update( function ( draft ) {
        Object.assign( draft.options, data );
        return write( draft );
      });
    },
    seed: function ( list ) {
      update( function ( draft ) {
        for ( const identity of list ) {
          const key = buildKey( identity );
          identity.key = key;
          if ( draft.identities[ key ] == null ) {
            Object.assign( draft.identities, {
              [ key ]: identity 
            });
          }
        }

        return write( draft );
      })
      
    }
  };
};


export const draft = createDraft();
