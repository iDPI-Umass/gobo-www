import { Platforms } from "$lib/engines/platforms/index.js";
import { Preview } from "$lib/engines/link-preview.js";
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

Thread.ignoredPlatforms = new Set([
  "linkedin",
  "reddit"
]);


Thread.parse = ( draft ) => {
  const thread = draft.content;
  const platforms = Thread.getPlatforms( draft );
  
  const posts = [];
  for ( const platform of platforms ) {
    const Model = Platforms.get( platform );

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
    
    // We convert this to Markdown for several reasons:
    // 1. Platforms ultimately expect posts to be in a more plaintext form, not HTML
    // 2. We need to support arbitrary character splitting, and HTML tags complicate that
    // 3. Because of (1), our length calculations rely on plaintext characters.
    const markdown = toMarkdown( html );
    const parts = markdown.split( DELIMITER );
    
    // Assemble the parts for this platform alongside the other platforms.
    let index = 0;
    for ( const part of parts ) {
      const content = part.trim();
      const attachments = [];
      const item = { index, platform, content, attachments };
      Preview.decorateItem( item );
      posts[ index ] ??= [];
      posts[ index ].push( item );
      index++;
    }
  }

  return posts;
};


export {
  Thread
}