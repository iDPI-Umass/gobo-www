import { Draft } from "$lib/engines/draft.js";
import * as markdown from "$lib/helpers/markdown.js";
import {
  PUBLIC_BLUESKY_LINK_PREVIEW_URL
} from '$env/static/public';


let previewURL;
const parser = new DOMParser();

const Preview = {};

Preview.fetch = async ( target ) => {
  const url = new URL( PUBLIC_BLUESKY_LINK_PREVIEW_URL );
  url.searchParams.set( "url", target );

  const response = await fetch( url );
  if ( response.status !== 200 ) {
    console.warn( "non-200 response from Bluesky link preview service" );
    return;
  }

  const preview = await response.json();
  if ( preview.error != null && preview.error.length > 0 ) {
    console.warn( "error from Bluesky link preview service", preview );
    return;
  }

  return preview;
};

Preview.clear = () => {
  previewURL = null;
  Draft.updateAspect( "linkPreview", {} );
};

Preview.put = ( value ) => {
  Draft.updateAspect( "linkPreview", value );
};

Preview.fromContent = async ( content ) => {
  if ( content == null || content == "" ) {
    Preview.clear();
    return;
  }

  const html = markdown.render( content );
  const dom = parser.parseFromString( html, "text/html" );
  const link = dom.querySelector( "a" );
  
  if ( link == null ) {
    Preview.clear();
    return;
  }

  const url = link.href;
  if ( url !== previewURL ) {
    previewURL = url;
    let value = await Preview.fetch( previewURL );
    value ??= {};
    Preview.put( value );
  }
};


export {
  Preview
}