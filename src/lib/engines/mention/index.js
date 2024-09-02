import * as Type from "@dashkite/joy/type"
import { Platforms } from "$lib/engines/mention/platforms/index.js"

const Mention = {};

Mention.make = ( platform, id ) => {
  const Model = Platforms.get( platform )
  const value = Model.mentionFromName( "@" );
  return { 
    platform, 
    id,
    value,
    type: Model.resolveType( value ),
  };
};

Mention.update = ( mention, value ) => {
  value ??= "";
  const Model = Platforms.get( mention.platform );
  mention.value = value
  mention.type = Model.resolveType( value );
};

Mention.getSuggestions = async ( mention, identity, query ) => {
  const Model = Platforms.get( mention.platform );
  try {
    return await Model.getSuggestions( identity, query );
  } catch ( error ) {
    console.warn( error );
    return [];
  }
};



const Mentions = {};

// Match on v4 UUID we get from the Crypto API (with type prefix).
Mentions.regex = /mention:(?<id>[a-fA-F0-9-]{36})/g;
Mentions.replaceRegex = new RegExp(
  '(?<before> |\u00A0)?' +
  Mentions.regex.source + 
  '(?<after> |\u00A0)?',
  'g'
);

Mentions.parse = ( content ) => {
  const matches = content.matchAll( Mentions.regex )
  const ids = [];
  for ( const matchArray of matches ) {
    ids.push( matchArray[1] );
  }
  return ids;
};

Mentions.preserveExisting = ( platform, existingMentions, mentionIDs ) => {
  const mentions = {};
  if ( mentionIDs.length === 0 ) {
    return mentions;
  }

  const existing = existingMentions[ platform ] ?? {};
  
  for ( const id of mentionIDs ) {
    mentions[ id ] = existing[ id ] ?? Mention.make( platform, id );
  }

  return mentions;
}

Mentions.unroll = ( threadRow ) => {
  const seen = new Set();
  const mentions = [];
  for (const item of threadRow) {
    for (const mention of Object.values(item.mentions)) {
      const { id } = mention;
      if ( !seen.has(id) ) {
        seen.add( id );
        mentions.push( mention );
      }
    }
  }
  return mentions;
}

Mentions.fromValue = ( threadItem, value ) => {
  if (threadItem?.mentions) {
    return Object.values(threadItem.mentions).find( m => m.value === value );
  }
};


// If someone enters an empty string into the placeholder, we need to avoid
// a double space situation in the post preview.
Mentions.renderPlaintext = ( threadItem ) => {
  return threadItem.content.replaceAll( Mentions.replaceRegex, (match, ...rest) => {
    const groups = rest.at(-1);
    console.log(groups)
    const { before = "", after = "", id } = groups;
    const mention = threadItem.mentions[ id ];
    if ( mention == null ) {
      console.warn( `unable to match on ${id}`, threadItem );
      return match;
    }

    if ( mention.value === "" ) {
      return " ";
    } else {
      return before + mention.value + after;
    }
  });
};

Mentions.renderHTML = ( threadItem, html ) => {
  return html.replaceAll( Mentions.replaceRegex, (match, ...rest) => {
    const groups = rest.at(-1);
    const { before = "", after = "", id } = groups;
    const mention = threadItem.mentions[ id ];
    if ( mention == null ) {
      console.warn( `unable to match on ${id}`, threadItem );
      return match;
    }

    if ( mention.value === "" ) {
      return " ";
    }

    if ( mention.type === "handle" ) {
      return before + 
        `<a data-skip-glamor="true" href="#">${ mention.value }</a>` +
        after;
    } else {
      return before + mention.value + after;
    }
  });
};


export {
  Mention,
  Mentions
}