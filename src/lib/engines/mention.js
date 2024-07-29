
const Mention = {};

Mention.make = ( name, index ) => {
  return {
    name,
    index,
    value: name
  }
};

// Mention.render = ( mention ) => {
//   switch ( mention.selected ) {
//     case "literal":
//       return mention.name;
//     default:
//       throw new Error( `cannot render unknown mention selection "${mention.selected}"` );
//   }
// };

Mention.fromIndex = ( mentions, index ) => {
  mentions ??= {};
  return Object.values(mentions).find( mention => mention.index === index );
}



const Mentions = {};

Mentions.regex = /@[^\s.,?!:;'"\(\)\[\]\{\}]*/g;

Mentions.parse = ( content, previousMentions ) => {
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
      mentions[ name ] = Mention.make( name, index );
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



const Autocomplete = {};

Autocomplete.fetch = async () => {
  return [
    "David Smith",
    "Dave Casey",
    "Daniel Thomas"
  ]
};


export {
  Mention,
  Mentions,
  Autocomplete
}