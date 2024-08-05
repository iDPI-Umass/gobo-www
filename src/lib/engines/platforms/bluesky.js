import * as linkify from "linkifyjs";
import { filesize } from "filesize";
import { RichText, BskyAgent, UnicodeString } from "@atproto/api";
import { Draft, Identity } from "$lib/engines/draft.js";
import { DraftFile } from "$lib/engines/draft-file.js";
import { extract } from "./helpers.js";


const Bluesky = {};

Bluesky.limits = {
  characters: 300,
  attachments: 4,
  image: {
    types: [
      "image/jpeg",
      "image/png",
      "image/webp"
    ],
    size: 1048576  // 1 MiB
  }
};

Bluesky.agent = new BskyAgent({ service: "https://bsky.app" });

Bluesky.contentLength = ( content ) => {
  if ( content == null ) {
    return 0;
  }

  const links = linkify.find( content, "url" );
  let length = content.length;
  let surplus = 0;
  
  for ( const link of links ) {
    const url = new URL( link.href );
    if ( url.pathname.length > 16 ) {
      surplus += ( url.pathname.length - 16 );
    }
    if ( link.value.startsWith("https://") ) {
      surplus += 8;
    }
    else if ( link.value.startsWith("http://") ) {
      surplus += 7;
    }
  }
  
  return length - surplus;
};


// Bluesky truncates URLs into a "domain plus 16" format that will ellide
// URLs that go over the limit while leaving short URLs unchanged.
Bluesky.shortURL = ( _url ) => {
  try {
    const url = new URL( _url );
    const target = url.pathname + url.search + url.hash;
    if ( target.length > 15 ) {
      return url.host + target.slice( 0, 13 ) + "...";
    }
    return url.host + target;
  
  } catch (error) {
    return _url
  }
};

// This is focused only on how URLs appear in the preview. Currently, it matches
// the shortURL facet calculation, but that might diverge somehow, as it does
// in Mastodon. This provides interface uniformity. Maybe move this elsewhere.
Bluesky.urlGlamor = Bluesky.shortURL;


Bluesky.findLink = ( facet ) => {
  const type = "app.bsky.richtext.facet#link";
  return facet.features.find( f => f.$type === type );
};

Bluesky.isLink = ( facet ) => {
  return Bluesky.findLink( facet ) != null;
}

Bluesky.shortenLink = ( rt, facet ) => {
  const { byteStart, byteEnd } = facet.index;
  const url = rt.unicodeText.slice( byteStart, byteEnd );
  const shortened = new UnicodeString( Bluesky.shortURL( url ));
  
  // insert the shortened URL
  rt.insert( byteStart, shortened.utf16 );
  
  // update the facet to cover the new shortened URL
  facet.index.byteStart = byteStart;
  facet.index.byteEnd = byteStart + shortened.length;

  // remove the old URL, now placed after the inserted short URL.
  rt.delete( byteStart + shortened.length, byteEnd + shortened.length );
}

// TODO: Do we need to perform this extraction?
// 1. We can hand-code what validation stuff we need, then use the Bluesky 
//    affordance of accepting a plain string to avoid all this.
//    Right now, the atproto library makes network requests to Bluesky to come
//    up with facets, but we still have to do tedious string calculations. So
//    we take on heft and asynchronicity, but we get little value in exchange.
//    We're allowed to submit simple strings to Bluesky. We could return to that
//    if we can handle our own validation needs sufficiently.
// 
// 2. Or we can bring the validation Bluesky block into alignment with this and
//    try to involve the atproto library for a higher fidelity check.
Bluesky.extractFacets = async ( content ) => {
  if ( content == null || content == "" ) {
    return { text: "", facets: [] };
  }

  const rt = new RichText({ text: content });
  await rt.detectFacets( Bluesky.agent );
  let facets = rt.facets ?? [];
  
  // Go through each facet and update the rich text instance.
  for ( const facet of facets ) {
    if ( Bluesky.isLink( facet )) {
      Bluesky.shortenLink( rt, facet );
    }
  }

  // Return the resulting text computation.
  return { facets, text: rt.text };
};

Bluesky.fetchCardImage = async ( url ) => {
  const response = await fetch( url );
  const mime = response.headers.get( "content-type" ) ?? "image/jpeg";
  const blob = await response.blob();
  return { mime, blob };
};

Bluesky.uploadCardImage = async ( file ) => {
  const draftFile = DraftFile.fromFile( file );
  await draftFile.create();
  await draftFile.upload();
  return draftFile.id;
};

Bluesky.buildCard = async ( context ) => {
  if ( context.url == null ) {
    return;
  }

  const linkCard = {
    url: context.url,
    title: context.title,
    description: context.description
  };

  if ( context.image != null && context.image.length > 0 ) {
    const image = await Bluesky.fetchCardImage( context.image );
    const id = await Bluesky.uploadCardImage( image.blob );
    linkCard.image = { id, mime: image.mime };
  }

  return linkCard;
};

Bluesky.buildItem = async ( item ) => {
  const { facets, text } = await Bluesky.extractFacets( item.content );
  const linkCard = await Bluesky.buildCard( item.linkPreview );

  item.metadata ??= {};
  Object.assign( item.metadata, {
    facets,
    text,
    linkCard
  });
};

Bluesky.build = async ( draft ) => {
  const thread = extract( "bluesky", draft );
  thread[0].metadata ??= {};

  if ( draft.reply?.data != null ) {
    const id = draft.reply.data.feed[0];
    thread[0].metadata.reply = draft.reply.data.posts.find( p => p.id == id );
  }

  if ( draft.quote?.data != null ) {
    const id = draft.quote.data.feed[0];
    thread[0].metadata.quote = draft.quote.data.posts.find( p => p.id == id );
  }

  for ( const item of thread ) {
    await Bluesky.buildItem( item );
  }
  
  return thread;
};



Bluesky.validateAttachments = ( draft ) => {
  if ( draft.attachments.length > Bluesky.limits.attachments ) {
    Draft.pushAlert(
      `Bluesky does not allow more than ${Bluesky.limits.attachments} attachments per post.`
    );
    return false;
  }

  const limits = Bluesky.limits.image;
  for ( const attachment of draft.attachments ) {
    const type = attachment.type;
    if ( !limits.types.includes( type )) {
      Draft.pushAlert(
        `Bluesky does not accept attachments of type ${ type }`
      );
      return false;
    }

    const size = attachment.size;
    if ( size > limits.size ) {
      Draft.pushAlert(
        `Bluesky does not accept attachments larger than ${filesize( limits.size )}`
      )
      return false;
    }
  }
  return true;
};


Bluesky.validateThreadElement = ( element ) => {
  const { index, content } = element;
  
  if ( Bluesky.contentLength(content) > Bluesky.limits.characters ) {
    const number = new Intl.NumberFormat().format( Bluesky.limits.characters );
    Draft.pushAlert(
      `Bluesky does not accept posts with more than ${ number } characters. (post ${index + 1})`
    );
    return false;
  }

  if ( (content == null) || (content === "") ) {
    Draft.pushAlert(
      `Bluesky does not allow empty post content. (post ${index + 1})`
    );
    return false;
  }

  return true;
};

Bluesky.validateThread = ( draft ) => {
  const thread = extract( "bluesky", draft );
  for ( const element of thread ) {
    if ( !Bluesky.validateThreadElement( element ) ){
      return false;
    }
  }

  return true;
};

Bluesky.validate = ( draft ) => {
  if ( !Identity.hasBluesky() ) {
    return true;
  }

  if ( !Bluesky.validateThread( draft )) {
    return false;
  }

  if ( !Bluesky.validateAttachments( draft )) {
    return false;
  }

  return true;
};




export {
  Bluesky
}