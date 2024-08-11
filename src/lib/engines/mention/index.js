import * as Type from "@dashkite/joy/type"
import { Platforms } from "$lib/engines/mention/platforms/index.js"

const Mention = {};

Mention.make = ( platform, name, index ) => {
  const Model = Platforms.get( platform )
  const value =  Model.mentionFromName( name );
  const type = Model.resolveType( value );
  return { platform, name, index, value, type };
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

Mentions.sort = ( mentions ) => {
  mentions ??= {};
  return Object.values(mentions).sort((A, B) => {
    if ( A.index < B.index ) {
      return -1;
    }
    if ( A.index > B.index ) {
      return 1;
    }
    return 0;
  });
}

Mentions.lookupName = ( mentions, index ) => {
  return mentions?.[ index ]?.name ?? ""
}


/**
 * This looks weird, but we have a tricky problem to solve:
 * 1. Mentions have an appearance specific to the textarea HX
 * 2. For each target platform, we want that to appear differently
 * 
 * Those are two different domain. In issuing a regex replacement, we need to
 * avoid collisions across mentions *and* across domains represented by (1) and (2).
 * 
 * That's hard because we don't know how many there are or in what order
 * they might appear. So this approach uses a third domain, a "shatter space"
 * to keep intermediate string values safely organized in a way that's
 * orthogonal to any pending string mutations.
 * 
 * So we transition fully from domain (1) into the shatter space, so we can
 * get safe regex locks. That creates a tree of nested arrays containing
 * string fragments.
 * 
 * Then we transition from shatter space int domain (2), reassembling the
 * string with the desired replacement values.
 */


Mentions.split = ( shattered, regex ) => {
  if ( Type.isString(shattered[0]) ) {
    for (let i = 0; i < shattered.length; i++) {
      const current = shattered[i];
      console.log( current, current.split( regex ));
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
    console.log(JSON.stringify(parts, null, 2))
    Mentions.split( parts, regex )
  }
  console.log(JSON.stringify(parts, null, 2))

  for ( const value of values.reverse() ) {
    Mentions.join( parts, value );
  }

  console.log(JSON.stringify(parts, null, 2))
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
    
    const regex = Mentions.buildRegex( mention.name );
    console.log(JSON.stringify(parts, null, 2))
    Mentions.split( parts, regex )
  }
  console.log(JSON.stringify(parts, null, 2))

  for ( const value of values.reverse() ) {
    Mentions.join( parts, value );
  }

  console.log(JSON.stringify(parts, null, 2))
  return parts[0];
};


export {
  Mention,
  Mentions
}