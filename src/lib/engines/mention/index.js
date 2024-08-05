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

Mentions.regex = /@([^\s,?!:;'"\(\)\[\]\{\}])*/g;

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


export {
  Mention,
  Mentions
}