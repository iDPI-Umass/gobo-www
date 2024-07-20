import { Draft } from "$lib/engines/draft.js";
import { getConverter } from "$lib/helpers/markdown.js";
import {
  PUBLIC_BLUESKY_LINK_PREVIEW_URL
} from '$env/static/public';

const toHTML = getConverter( "gobo" )

const parser = new DOMParser();
const cache = {};

const Preview = {};

Preview._fetch = async ( target ) => {
  const url = new URL( PUBLIC_BLUESKY_LINK_PREVIEW_URL );
  url.searchParams.set( "url", target );

  const response = await fetch( url );
  if ( response.status !== 200 ) {
    console.warn( "non-200 response from Bluesky link preview service" );
    return {};
  }

  const preview = await response.json();
  if ( preview.error != null && preview.error.length > 0 ) {
    console.warn( "error from Bluesky link preview service", preview );
    return {};
  }

  return preview;
};

Preview.fetch = async ( target ) => {
  if ( target == null ) {
    return {};
  }
  cache[ target ] ??= Preview._fetch( target );
  return await cache[ target ];
};

Preview.clear = ( item ) => {
  item.previewURL = null;
  item.linkPreview = {};
};

Preview.decorateItem = ( item ) => {
  if ( item.content == null || item.content == "" ) {
    Preview.clear( item );
    return;
  }

  const html = toHTML( item.content );
  const dom = parser.parseFromString( html, "text/html" );
  const link = dom.querySelector( "a" );
  
  if ( link == null ) {
    Preview.clear( item );
    return;
  }

  const url = link.href;
  if ( url !== item.previewURL ) {
    item.previewURL = url;
  }
};


export {
  Preview
}