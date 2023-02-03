import { writable } from "svelte/store";
import { browser } from "$app/environment";
import * as LS from "$lib/stores/local-storage.js";

const buildKey = function ({ platform, account}) {
  return `${platform}::${account}`;
}

const createDraft = function () {
  let draft;

  if ( browser ) {
    draft = LS.read( "gobo-draft" );
  }

  if ( draft == null ) {
    draft = {
      identities: {},
      files: []
    };
  }

  const { subscribe, update } = writable( draft );
  
  return {
    subscribe,
    clear: function () {
      update( function () {
        return {};
      });
    },
    update: function ( data ) {
      update( function ( draft ) {
        Object.assign( draft, data );
        LS.write( "gobo-draft", draft );
        return draft;
      });
    },
    updateIdentity: function ( data ) {
      update( function ( draft ) {
        Object.assign( draft.identities, data );
        LS.write( "gobo-draft", draft );
        return draft;
      });
    },
    buildKey: buildKey,
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

        LS.write( "gobo-draft", draft );
        return draft;
      })
      
    }
  };
};


export const draft = createDraft();
