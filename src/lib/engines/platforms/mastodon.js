import * as linkify from "linkifyjs";
import { Draft, Identity } from "$lib/engines/draft.js";


const Mastodon = {};

Mastodon.limits = {
  characters: 500,
  attachments: 4,

  // From: https://docs.joinmastodon.org/user/posting/#media
  images: {
    types: [
      "image/gif",
      "image/heic",
      "image/heif",
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
    size: 16000000  // 16 MB
  }
};

// This is unrelated to the character length calcluation below.
// This aims to emperically mimic the visual representation of URLs in the
// Mastodon client. They show more characters and remove the scheme.
Mastodon.urlGlamor = ( _url ) => {
  const url = new URL( _url );
  let string = url.host + url.pathname;
  if ( string.length > 30 ) {
    string = string.slice( 0, 30 ) + "…";
  }  
  return string;
};

// From: https://docs.joinmastodon.org/user/posting/
// "All links are counted as 23 characters, no matter how long they actually are"
Mastodon.contentLength = () => {
  const draft = Draft.read();
  if ( draft.content == null ) {
    return 0;
  }

  const links = linkify.find( draft.content, "url" );
  let length = draft.content.length;
  let surplus = 0;
  
  for ( const link of links ) {
    surplus -= 23 - link.href.length;
  }
  
  return length - surplus;
};

Mastodon.buildVisibility = ( draft ) => {
  switch ( draft.options.mastodon.visibility ) {
    case null:
    case "public":
      return "public";
    case "unlisted":
      return "unlisted";
    case "private":
    case "followers only":
      return "private";
    case "direct":
      return "direct"
  }
};

Mastodon.build = ( draft ) => {
  let reply;
  if ( draft.reply?.data != null ) {
    const id = draft.reply.data.feed[0];
    reply = draft.reply.data.posts.find( p => p.id == id );
  }

  return {
    visibility: Mastodon.buildVisibility( draft ),
    spoiler: draft.options.mastodon.spoilerText,
    sensitive: draft.options.attachments.sensitive,
    reply
  };
};


Mastodon.validateAttachments = ( draft ) => {
  const limits = Mastodon.limits.images;
  for ( const attachment of draft.attachments ) {
    const type = attachment.file.type;
    if ( !type.startsWith( "image" )) {
      Draft.pushAlert(
        `Gobo currently supports images only.`
      );
      return false;      
    }
    
    if ( !limits.types.includes( type )) {
      Draft.pushAlert(
        `Mastodon does not accept attachments of type ${ type }`
      );
      return false;
    }

    const size = attachment.file.size;
    if ( size > limits.size ) {
      Draft.pushAlert(
        `Mastodon does not accept attachments larger than ${filesize( limits.size )}`
      )
      return false;
    }
  }
  return true;
};

Mastodon.validate = ( draft ) => {
  if ( !Identity.hasMastodon() ) {
    return true;
  }

  if ( Mastodon.contentLength() > Mastodon.limits.characters ) {
    const number = new Intl.NumberFormat().format( Mastodon.limits.characters );
    Draft.pushAlert(
      `Mastodon does not accept posts with more than ${ number } characters.`
    );
    return false;
  }

  if ( (draft.content == null) || (draft.content === "") ) {
    Draft.pushAlert(
      `Mastodon does not allow empty post content.`
    );
    return false;
  }

  if ( draft.attachments.length > Mastodon.limits.attachments ) {
    Draft.pushAlert(
      `Mastodon does not allow more than ${Mastodon.limits.attachments} attachments per post.`
    );
    return false;
  }

  if ( !Mastodon.validateAttachments( draft )) {
    return false;
  }

  return true;
};


export {
  Mastodon
}