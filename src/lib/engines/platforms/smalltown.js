import { Draft, Identity } from "$lib/engines/draft.js";
import { Mastodon } from "$lib/engines/platforms/mastodon.js";
import { Mentions } from "$lib/engines/mention/index.js";
import { extract } from "./helpers.js";


const Smalltown = {};

Smalltown.displayName = "Smalltown";

Smalltown.limits = {
  characters: 500,
  attachments: 4,

  // From: https://docs.joinmastodon.org/user/posting/#media
  image: {
    types: [
      "image/gif",
      "image/heic",
      "image/heif",
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
    size: 16000000  // 16 MB
  },

  audio: {
    types: [
      "audio/aac",
      "audio/mpeg",
      "audio/mp4",
      "audio/flac",
      "audio/wav",
      "audio/opus",
      "audio/vorbis",      
      "audio/ogg",
      "audio/3gpp",
    ],
    size: 99000000  // 99 MB
  },

  video: {
    types: [
      "video/mp4",
      "video/quicktime",
      "video/webm",
    ],
    size: 99000000  // 99 MB
  }
};


// For now, these are based on the Mastodon helpers.
Smalltown.urlGlamor = Mastodon.urlGlamor;
Smalltown.contentLength = Mastodon.contentLength;

Smalltown.buildItem = async ( draft, item ) => {
  item.content = Mentions.renderPlaintext( item );
  const spoiler = draft.options.mastodon.spoilerText;
  const sensitive = draft.options.attachments.sensitive;

  item.metadata ??= {};
  Object.assign( item.metadata, {
    spoiler,
    sensitive,
  });
};


Smalltown.build = ( draft ) => {
  const thread = extract( "smalltown", draft );
  thread[0].metadata ??= {};

  if ( draft.reply?.data != null ) {
    const id = draft.reply.data.feed[0];
    thread[0].metadata.reply = draft.reply.data.posts.find( p => p.id == id );
  }

  for ( const item of thread ) {
    Smalltown.buildItem( draft, item );
  }
  
  return thread;
};


const Validate = {};

Validate.image = ( attachment ) => {
  const limits = Smalltown.limits.image

  const type = attachment.type;
  if ( !limits.types.includes(type) ) {
    Draft.pushAlert(
      `Smalltown does not accept images of type ${ type }`
    );
    return false;
  }
  
  const size = attachment.size;
  if ( size > limits.size ) {
    Draft.pushAlert(
      `Smalltown does not accept image files larger than ${filesize( limits.size )}`
    )
    return false;
  }

  return true;
};

Validate.audio = ( attachment ) => {
  const limits = Smalltown.limits.audio

  const type = attachment.type;
  if ( !limits.types.includes(type) ) {
    Draft.pushAlert(
      `Smalltown does not accept audio of type ${ type }`
    );
    return false;
  }
  
  const size = attachment.size;
  if ( size > limits.size ) {
    Draft.pushAlert(
      `Smalltown does not accept audio files larger than ${filesize( limits.size )}`
    )
    return false;
  }

  return true;
};

Validate.video = ( attachment ) => {
  const limits = Smalltown.limits.video

  const type = attachment.type;
  if ( !limits.types.includes(type) ) {
    Draft.pushAlert(
      `Smalltown does not accept video of type ${ type }`
    );
    return false;
  }
  
  const size = attachment.size;
  if ( size > limits.size ) {
    Draft.pushAlert(
      `Smalltown does not accept video files larger than ${filesize( limits.size )}`
    )
    return false;
  }

  return true;
};


Smalltown.validateAttachments = ( draft ) => {
  if ( draft.attachments.length > Smalltown.limits.attachments ) {
    Draft.pushAlert(
      `Smalltown does not allow more than ${Smalltown.limits.attachments} attachments per post.`
    );
    return false;
  }

  for ( const attachment of draft.attachments ) {
    const name = attachment.name;
    const category = attachment.type.split( "/" )[0];
    if ( category == null ) {
      Draft.pushAlert(
        `Gobo cannot identify the media type of attachment ${ name }`
      );
      return false; 
    }

    if ( Validate[ category ] == null ) {
      Draft.pushAlert(
        `Smalltown does not support type ${ attachment.type }`
      );
      return false; 
    }

    const isValid = Validate[category]( attachment );
    if ( !isValid ) {
      return false;
    }
  }

  const hasGIF = !!draft.attachments.find( a => a.type === "image/gif" );
  if ( hasGIF && draft.attachments.length > 1 ) {
    Draft.pushAlert(
      `Smalltown requires that GIF posts have no other attachments.`
    );
    return false;
  }

  const hasAudio = !!draft.attachments.find( a => a.type.startsWith("audio") );
  if ( hasAudio && draft.attachments.length > 1 ) {
    Draft.pushAlert(
      `Smalltown requires that audio posts have no other attachments.`
    );
    return false;
  }

  const hasVideo = !!draft.attachments.find( a => a.type.startsWith("video") );
  if ( hasVideo && draft.attachments.length > 1 ) {
    Draft.pushAlert(
      `Smalltown requires that video posts have no other attachments.`
    );
    return false;
  }

  return true;
};

Smalltown.validateThreadElement = ( element ) => {
  const { index, content } = element;
  
  if ( Smalltown.contentLength(content) > Smalltown.limits.characters ) {
    const number = new Intl.NumberFormat().format( Smalltown.limits.characters );
    Draft.pushAlert(
      `Smalltown does not accept posts with more than ${ number } characters. (post ${index + 1})`
    );
    return false;
  }

  if ( (content == null) || (content === "") ) {
    Draft.pushAlert(
      `Smalltown does not allow empty post content. (post ${index + 1})`
    );
    return false;
  }

  return true;
};

Smalltown.validateThread = ( draft ) => {
  const thread = extract( "smalltown", draft );
  for ( const element of thread ) {
    if ( !Smalltown.validateThreadElement( element ) ){
      return false;
    }
  }

  return true;
};

Smalltown.validate = ( draft ) => {
  if ( !Identity.hasSmalltown() ) {
    return true;
  }

  if ( !Smalltown.validateThread( draft )) {
    return false;
  }

  if ( !Smalltown.validateAttachments( draft )) {
    return false;
  }

  return true;
};

export {
  Smalltown
}