import { Draft, Identity } from "$lib/engines/draft.js";
import { Mastodon } from "$lib/engines/platforms/mastodon.js";


const Smalltown = {};

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

Smalltown.build = ( draft ) => {
  let reply;
  if ( draft.reply?.data != null ) {
    const id = draft.reply.data.feed[0];
    reply = draft.reply.data.posts.find( p => p.id == id );
  }

  return {
    sensitive: draft.options.attachments.sensitive,
    spoiler: draft.options.smalltown.spoilerText,
    reply
  };
};


const Validate = {};

Validate.image = ( attachment ) => {
  const limits = Smalltown.limits.image

  const type = attachment.file.type;
  if ( !limits.types.includes(type) ) {
    Draft.pushAlert(
      `Smalltown does not accept images of type ${ type }`
    );
    return false;
  }
  
  const size = attachment.file.size;
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

  const type = attachment.file.type;
  if ( !limits.types.includes(type) ) {
    Draft.pushAlert(
      `Smalltown does not accept audio of type ${ type }`
    );
    return false;
  }
  
  const size = attachment.file.size;
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

  const type = attachment.file.type;
  if ( !limits.types.includes(type) ) {
    Draft.pushAlert(
      `Smalltown does not accept video of type ${ type }`
    );
    return false;
  }
  
  const size = attachment.file.size;
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
    const name = attachment.file.name;
    const category = attachment.file.type.split( "/" )[0];
    if ( category == null ) {
      Draft.pushAlert(
        `Gobo cannot identify the media type of attachment ${ name }`
      );
      return false; 
    }

    if ( Validate[ category ] == null ) {
      Draft.pushAlert(
        `Smalltown does not support type ${ attachment.file.type }`
      );
      return false; 
    }

    const isValid = Validate[category]( attachment );
    if ( !isValid ) {
      return false;
    }
  }

  const hasGIF = !!draft.attachments.find( a => a.file.type === "image/gif" );
  if ( hasGIF && draft.attachments.length > 1 ) {
    Draft.pushAlert(
      `Smalltown requires that GIF posts have no other attachments.`
    );
    return false;
  }

  const hasAudio = !!draft.attachments.find( a => a.file.type.startsWith("audio") );
  if ( hasAudio && draft.attachments.length > 1 ) {
    Draft.pushAlert(
      `Smalltown requires that audio posts have no other attachments.`
    );
    return false;
  }

  const hasVideo = !!draft.attachments.find( a => a.file.type.startsWith("video") );
  if ( hasVideo && draft.attachments.length > 1 ) {
    Draft.pushAlert(
      `Smalltown requires that video posts have no other attachments.`
    );
    return false;
  }

  return true;
};

Smalltown.validate = ( draft ) => {
  if ( !Identity.hasSmalltown() ) {
    return true;
  }

  if ( Smalltown.contentLength() > Smalltown.limits.characters ) {
    const number = new Intl.NumberFormat().format( Smalltown.limits.characters );
    Draft.pushAlert(
      `Smalltown does not accept posts with more than ${ number } characters.`
    );
    return false;
  }

  if ( (draft.content == null) || (draft.content === "") ) {
    Draft.pushAlert(
      `Smalltown does not allow empty post content.`
    );
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