import { Preview } from "$lib/engines/link-preview.js";
import { Mentions, Mention } from "$lib/engines/mention/index.js";
import { toMarkdown } from "$lib/helpers/markdown.js";

const parser = new DOMParser();
const DELIMITER = "--GOBO-THREADPOINT--";

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
  const existingThread = draft.thread;
  const raw = draft.content;

  const existingMentions = {};
  for ( const row of existingThread ) {
    for ( const item of row ) {
      existingMentions[ item.platform ] ??= {};
      for ( const mention of Object.values(item.mentions) ) {
        existingMentions[ item.platform ][ mention.id ] = mention;
      }
    }
  }

  const thread = [];
  const platforms = Thread.getPlatforms( draft );
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

    // Now gather matching threadpoint spans
    const threadpointElements = dom.querySelectorAll( "span.threadpoint" );
    
    // Save the attachment metadata we store on the threadponts.
    const threadpoints = [];
    threadpoints.push({ id: "head" });
    for ( const el of threadpointElements ) {
      threadpoints.push({ id: el.dataset.id });
    }
    
    // Convert the threadpoints into plaintext-compatible delimiters.
    for ( const el of threadpointElements ) {
      el.innerHTML = DELIMITER;      
    }

    // Now gather mention spans
    const mentionElements = dom.querySelectorAll( "span.mention" ); 
    
    // Convert the mentions unique references we can parse from plaintext.
    for (const el of mentionElements ) {
      el.innerHTML = `mention:${ el.dataset.id }`
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
      const existingItem = Thread.find( existingThread, index, platform );
      const content = part.trim();
      const mentionIDs = Mentions.parse( content );
      const mentions = Mentions.preserveExisting( platform, existingMentions, mentionIDs );
      
      const item = { 
        id: threadpoints[ index ].id,
        index,
        platform, 
        content,
        attachments: existingItem?.attachments ?? [],
        mentions,
      };

      Preview.decorateItem( item );
      thread[ index ] ??= [];
      thread[ index ].push( item );
      index++;
    }
  }

  return thread;
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