import { toMarkdown } from "$lib/helpers/markdown.js";

const parser = new DOMParser();
const DELIMITER = "GOBO-THREADPOINT--";

const Thread = {};

// Figure out which platforms we are actively considering for this draft.
Thread.getPlatforms = ( draft ) => {
  const current = new Set();
  for ( const identity of draft.identities ) {
    if ( identity.active === true ) {
      current.add( identity.platform );
    }
  }
  return Array.from( current );
};


Thread.parse = ( draft ) => {
  const thread = draft.content;
  const platforms = Thread.getPlatforms( draft );
  
  const posts = [];
  for ( const platform of platforms ) {
    const dom = parser.parseFromString( 
      `<div id='outermost'> ${thread} </div>`, 
      "text/html"
    );

    // First, purge threadpoints from other platforms.      
    const others = dom.querySelectorAll( 
      `span.threadpoint:not([data-platform='${ platform }'])`
    );
    for ( const el of others ) {
      el.remove();
    }

    // Now convert matching threadpoints to a plaintext-compatible delimiter.
    const matches = dom.querySelectorAll( "span.threadpoint" );
    for ( const el of matches ) {
      el.innerHTML = DELIMITER;
    }

    // Now get back the modified HTML.
    const html = dom.querySelector("#outermost").innerHTML;
    const markdown = toMarkdown( html );
    const parts = markdown.split( DELIMITER );
    for ( let i=0; i < parts.length; i++ ) {
      const content = parts[ i ].trim();
      posts[ i ] ??= [];
      posts[ i ].push({ platform, content });
    }
  }
  return posts;
};


export {
  Thread
}