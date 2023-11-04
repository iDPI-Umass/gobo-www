import { writable } from "svelte/store";
import * as LS from "$lib/helpers/local-storage.js";
import * as Type from "@dashkite/joy/type";


const buildKey = function ({ platform, account}) {
  return `${platform}::${account}`;
}

const isFile = function ( value ) {
  return Type.isType( File, value );
};

const isImage = function ( value ) {
  return /^image/.test( value.type );
};

const isVideo = function ( value ) {
  return /^video/.test( value.type );
};

const emptyDraft = function () {
  return {
    alert: null,
    identities: [],
    identitiesLoaded: "start",
    attachments: [],
    options: {
      spoiler: false,
      spoilerText: null,
      sensitive: false,
      visibility: "public",
      title: null,
      subreddit: null
    },
    content: null,
    reply: null,
    quote: null
  };
};

const createStore = function () {
  let draft = LS.read( "gobo-draft" );

  if ( draft == null ) {
    draft = emptyDraft();
  }
  draft.identities ??= [];
  draft.attachments ??= [];

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
