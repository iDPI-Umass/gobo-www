import { writable } from "svelte/store";
import { browser } from "$app/environment";
import * as LS from "$lib/helpers/local-storage.js";
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
};

const isImage = function ( value ) {
  return /^image/.test( value.type );
};

const isVideo = function ( value ) {
  return /^video/.test( value.type );
};

const emptyDraft = function () {
  return {
    identities: [],
    identitiesLoaded: false,
    files: [],
    options: {
      spoiler: false,
      spoilerText: null,
      sensitive: false,
      visibility: "public",
      title: null,
      subreddit: null
    },
    content: null
  };
};

const createStore = function () {
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
    return data;
  };
  
  return {
    subscribe,
    buildKey: buildKey,
    isFile: isFile,
    isImage: isImage,
    isVideo: isVideo,
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
    }
  };
};


export const draftStore = createStore();
