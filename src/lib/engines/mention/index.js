import * as Type from "@dashkite/joy/type"
import { Platforms } from "$lib/engines/mention/platforms/index.js"

const Mention = {};

Mention.make = ( platform, name, index ) => {
  const Model = Platforms.get( platform )
  const value = Model.mentionFromName( name );
  return { 
    platform, 
    name, 
    index, 
    value,
    type: Model.resolveType( value ),
    regex: Mentions.buildRegex( name ),
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

Mentions.beforeBoundary = `(?<=[\\s,.?!¿¡‽:;'"()[\\]{}<>|]|^)`;
Mentions.afterBoundary = `(?=[\\s,.?!¿¡‽:;'"()[\\]{}<>|]|$)`;
Mentions.allowed = `[^\\s,?!¿¡‽:;'"()[\\]{}<>|]`;
Mentions.buildRegex = ( core ) => {
  const string = Mentions.beforeBoundary + core + Mentions.afterBoundary;
  return new RegExp( string, "gu" );
};

Mentions.regex = Mentions.buildRegex( `@${ Mentions.allowed }*` );

Mentions.parse = ( content, platform, previousMentions ) => {
  previousMentions ??= {}
  const matches = content.matchAll( Mentions.regex )
  const names = [];
  for ( const matchArray of matches ) {
    names.push( matchArray[0] );
  }

  const mentions = {};
  for ( const [ index, name ] of names.entries() ) {
    const current = mentions[ name ];
    if ( current != null ) {
      // By fiat, duplicate mentions share their configuration.
      continue;
    }

    const previous = structuredClone( previousMentions[name] )
    if ( previous != null ) {
      // We want to retain the configuration of previously existing mentions,
      // but we need to adjust their index to capture order changes.
      previous.index = index;
      mentions[ name ] = previous;
    
    } else {
      // We're in the clear to make a default mention from scratch.
      mentions[ name ] = Mention.make( platform, name, index );
    }
  }

  return mentions;
}

Mentions.unroll = ( threadRow ) => {
  const seen = new Set();
  const mentions = [];
  for (const item of threadRow) {
    for (const mention of Object.values(item.mentions)) {
      const { name } = mention;
      if ( !seen.has(name) ) {
        seen.add( name );
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


/**
 * This looks weird, but there is a problem here that, in its general form is tricky.:
 * 1. Mentions have an appearance specific to the textarea HX
 * 2. For each target platform, we want that to appear differently
 * 
 * Those are two different domains. In issuing a regex replacement, we need to
 * avoid collisions across mentions *and* across domains represented by (1) and (2).
 * 
 * We can guard against that with careful regex building, and we do, but
 * beware the general case. We don't know how many mentions there are or
 * in what order they might appear. Or what features/formats we'll need to support.
 * 
 * We can eliminate the need for cross-domain checks with the following:
 * 
 * - I'm calling this third domain a "shatter space" because it uses
 *   String.prototype.split to create virtual placeholders that we don't need
 *   to name. That space can expand indefinitely, and it's all orthogonal
 *   to the collision concerns of (1) and (2).
 * 
 * - Transition fully from domain (1) into the shatter space, so we can
 *   get safe regex locks. That creates a tree of nested arrays containing
 *   string fragments.
 * 
 * - Then we transition from shatter space int domain (2), reassembling the
 *   string with the desired replacement values.
 */


Mentions.split = ( shattered, regex ) => {
  if ( Type.isString(shattered[0]) ) {
    for (let i = 0; i < shattered.length; i++) {
      const current = shattered[i];
      shattered[i] = current.split( regex );
    }
  } else {
    for ( const item of shattered ) {
      Mentions.split( item, regex )
    }
  }
};

Mentions.join = ( shattered, separator ) => {
  if ( Type.isString(shattered[0][0]) ) {
    for (let i = 0; i < shattered.length; i++) {
      const current = shattered[i];
      shattered[i] = current.join( separator );
    }
  } else {
    for (const item of shattered) {
      Mentions.join( item, separator );
    }
  }
};

Mentions.renderPlaintext = ( threadItem ) => {
  const parts = [ threadItem?.content ?? '' ]
  const values = []
  for (const mention of Object.values(threadItem.mentions)) {
    values.push( mention.value );
    const regex = Mentions.buildRegex( mention.name );
    Mentions.split( parts, regex )
  }

  for ( const value of values.reverse() ) {
    Mentions.join( parts, value );
  }

  return parts[0];
};

Mentions.renderHTML = ( threadItem, html ) => {
  const parts = [ html ?? '' ]
  const values = []
  for (const mention of Object.values(threadItem.mentions)) {
    if ( mention.type === "handle" ) {
      values.push( `<a data-skip-glamor="true" href="#">${ mention.value }</a>` );
    } else {
      values.push( mention.value );
    }
    Mentions.split( parts, mention.regex )
  }

  for ( const value of values.reverse() ) {
    Mentions.join( parts, value );
  }

  return parts[0];
};


export {
  Mention,
  Mentions
}