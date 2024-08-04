import { Preview } from "$lib/engines/link-preview.js";
import { Mentions } from "$lib/engines/mention/index.js";
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


Thread.splice = ( thread, item ) => {
  const row = thread[ item.index ];
  if ( row == null ) {
    console.warn( "Failed to splice thread. row is not within current thread.");
    return;
  }

  const target = row.find( i => i.platform === item.platform );
  if ( target == null ) {
    console.warn( "Failed to splice thread. platform is not within current row.");
  }

  Object.assign( target, item );
};


Thread.parse = ( draft ) => {
  const old = draft.thread;
  const raw = draft.content;
  const platforms = Thread.getPlatforms( draft );
  
  const results = [];
  for ( const platform of platforms ) {
    const dom = parser.parseFromString( 
      `<div id='outermost'> ${raw} </div>`, 
      "text/html"
    );

    // First, purge threadpoints from other platforms.      
    const others = dom.querySelectorAll( 
      `span.threadpoint:not([data-platform='${ platform }'])`
    );
    for ( const el of others ) {
      el.remove();
    }

    // Now gather matching threadpoints
    const matches = dom.querySelectorAll( "span.threadpoint" );
    
    // Save the attachment metadata we store on the threadponts.
    const threadpoints = [];
    threadpoints.push({ id: "head" });
    for ( const el of matches ) {
      threadpoints.push({ id: el.dataset.id });
    }
    
    // Convert the threadpoints into plaintext-compatible delimiters.
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
      const oldItem = Thread.find( old, index, platform );
      const item = { 
        id: threadpoints[ index ].id,
        index,
        platform, 
        content,
        attachments: oldItem?.attachments ?? [],
        mentions: Mentions.parse( content, platform, oldItem?.mentions )
      };

      Preview.decorateItem( item );
      results[ index ] ??= [];
      results[ index ].push( item );
      index++;
    }
  }

  return results;
};

Thread.find = ( thread, index, platform ) => {
  return thread?.[ index ]?.find( item => item.platform === platform );
};


const Anchor = {};

Anchor.add = ( thread, item, file ) => {
  const match = Thread.find( thread, item.index, item.platform );
  if ( match == null ) {
    console.warn( `unable to match on thread slot ${item.index} ${item.platform}` );
    return;
  }
  match.attachments.push( file.id );
};

Anchor.remove = ( thread, item, file ) => {
  const match = Thread.find( thread, item.index, item.platform );
  if ( match == null ) {
    console.warn( `unable to match on thread slot ${item.index} ${item.platform}` );
    return;
  }
  const index = match.attachments.findIndex( id => id === file.id );
  if ( index > -1 ) {
    match.attachments.splice( index, 1 );
  }
};


export {
  Thread,
  Anchor
}