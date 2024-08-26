import * as linkify from "linkifyjs";
import { filesize } from "filesize";
import { Draft, Identity } from "$lib/engines/draft.js";
import { Mentions } from "$lib/engines/mention/index.js";
import { extract } from "./helpers.js";


const Linkedin = {};

Linkedin.displayName = "LinkedIn";

Linkedin.limits = {
  characters: 3000,
  attachments: 20,

  // From: https://www.linkedin.com/help/linkedin/answer/a564109
  image: {
    types: [
      "image/gif",
      "image/heic",
      "image/heif",
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
    size: 100000000  // 100 MB
  },

  // The above LinkedIn answer lists many media formats, but it must be focused
  // too much on codecs, rather than mediatypes accepted by the API.
  // Audio MP3 is explicitly listed, but on this *other* answer:
  // https://www.linkedin.com/help/learning/answer/a702912
  // we find out that MP3 audio MIME types are not allowed. You're expected
  // to format it as a video with a static image, backed by that audio track.
  // There is more work here.
  audio: {
    types: [
      "audio/aac",
      // "audio/mpeg", 
      "audio/flac",
      "audio/wav",
      "audio/opus",
      "audio/vorbis",      
      "audio/ogg",
    ],
    size: 100000000  // 100 MB
  },

  video: {
    types: [
      "video/mp4",
      "video/quicktime",
      "video/avi",
      "video/x-msvideo",
      "video/webm",
      "video/x-matroska",
      "video/x-ms-wmv",
      "video/x-ms-asf",
      "video/vc1",
      "video/mpeg",
    ],
    size: 100000000  // 100 MB
  },

  // TODO: eventually, we'll want to work on supporting uploading documents
  //  to LinkedIn using their Documents API.
  // document: {
  //   types: [
  //     "application/msword",
  //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //     "application/vnd.oasis.opendocument.text",
  //     "application/vnd.ms-powerpoint",
  //     "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  //     "application/pdf",
  //     "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
  //     "application/vnd.oasis.opendocument.spreadsheet",
  //     "application/vnd.ms-excel",
  //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  //   ],
  //   size: 100000000  // 100 MB
  // }
};

// These won't be real shortened links, but they approximate the appearance
// by always coming in at 26 characters.
Linkedin.urlGlamor = ( _url ) => {
  if ( _url.length > 26 ) {
    return "https://lnkd.in/e3rvsvVTsd";
  } else {
    return _url;
  }
};

// From https://www.linkedin.com/help/linkedin/answer/a521889/short-urls-in-shared-posts
// "When you share a link that's longer than 26 characters, we automatically 
// shorten it once you click Post, to make it easier to read."
Linkedin.contentLength = ( threadItem ) => {
  if ( threadItem?.content == null ) {
    return 0;
  }

  const content = Mentions.renderPlaintext( threadItem );
  const length = content.length;
  let surplus = 0;

  const links = linkify.find( content, "url" );  
  for ( const link of links ) {
    if ( link.href.length > 26 ) {
      surplus += link.href.length - 26;
    }
  }
  
  return length - surplus;
};

// TODO: There is a looming problem here on the visiblity question.
// Unlike the other current platforms, LinkedIn uses a double-opt-in social
// edge model. So the generic word would be something like "mutals".
// That affects graph calculations in theory, but we can't acutally do that
// much with LinkedIn's graph at the moment.
Linkedin.buildVisibility = ( draft ) => {
  switch ( draft.options.linkedin.visibility ) {
    case null:
    case "public":
      return "PUBLIC";
    case "mutuals":
      return "CONNECTIONS";
  }
};

// The LinkedIn API handles the generation of the link preview, so long as we
// acknowledge that it exists.
Linkedin.buildCard = async ( context ) => {
  if ( context.url == null ) {
    return;
  }
  return { url: context.url };
};

Linkedin.buildItem = async ( draft, item ) => {
  item.content = Mentions.renderPlaintext( item );
  const linkCard = await Linkedin.buildCard( item.linkPreview );
  const visibility = Linkedin.buildVisibility( draft );

  item.metadata ??= {};
  Object.assign( item.metadata, {
    linkCard,
    visibility,
  });
};

Linkedin.build = async ( draft ) => {
  const thread = extract( "linkedin", draft );
  for ( const item of thread ) {
    await Linkedin.buildItem( draft, item );
  }

  return thread;
};


const Validate = {};

Validate.image = ( attachment ) => {
  const limits = Linkedin.limits.image

  const type = attachment.type;
  if ( !limits.types.includes(type) ) {
    Draft.pushAlert(
      `LinkedIn does not accept images of type ${ type }`
    );
    return false;
  }
  
  const size = attachment.size;
  if ( size > limits.size ) {
    Draft.pushAlert(
      `LinkedIn does not accept image files larger than ${filesize( limits.size )}`
    )
    return false;
  }

  return true;
};

Validate.audio = ( attachment ) => {
  const limits = Linkedin.limits.audio

  const type = attachment.type;
  if ( !limits.types.includes(type) ) {
    Draft.pushAlert(
      `LinkedIn does not accept audio of type ${ type }`
    );
    return false;
  }
  
  const size = attachment.size;
  if ( size > limits.size ) {
    Draft.pushAlert(
      `LinkedIn does not accept audio files larger than ${filesize( limits.size )}`
    )
    return false;
  }

  return true;
};

Validate.video = ( attachment ) => {
  const limits = Linkedin.limits.video

  const type = attachment.type;
  if ( !limits.types.includes(type) ) {
    Draft.pushAlert(
      `LinkedIn does not accept video of type ${ type }`
    );
    return false;
  }
  
  const size = attachment.size;
  if ( size > limits.size ) {
    Draft.pushAlert(
      `LinkedIn does not accept video files larger than ${filesize( limits.size )}`
    )
    return false;
  }

  return true;
};

// TODO: integrate with the document API.
Validate.application = ( attachment ) => {
  Draft.pushAlert(
    `Gobo does not currently support adding documents to LinkedIn posts.`
  )
  return false;

  // const limits = Linkedin.limits.document

  // const type = attachment.type;
  // if ( !limits.types.includes(type) ) {
  //   Draft.pushAlert(
  //     `LinkedIn does not accept files of type ${ type }`
  //   );
  //   return false;
  // }
  
  // const size = attachment.size;
  // if ( size > limits.size ) {
  //   Draft.pushAlert(
  //     `LinkedIn does not accept files larger than ${filesize( limits.size )}`
  //   )
  //   return false;
  // }

  // return true;
};



Linkedin.validateAttachments = ( draft ) => {
  if ( draft.attachments.length > Linkedin.limits.attachments ) {
    Draft.pushAlert(
      `LinkedIn does not allow more than ${Linkedin.limits.attachments} attachments per post.`
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
        `LinkedIn does not support type ${ attachment.type }`
      );
      return false; 
    }

    const isValid = Validate[category]( attachment );
    if ( !isValid ) {
      return false;
    }
  }

  const hasVideo = !!draft.attachments.find( a => a.type.startsWith("video") );
  if ( hasVideo && draft.attachments.length > 1 ) {
    Draft.pushAlert(
      `LinkedIn requires that video posts have no other attachments.`
    );
    return false;
  }

  return true;
};

Linkedin.validateThreadElement = ( element ) => {
  const { index, content } = element;
  
  if ( Linkedin.contentLength(element) > Linkedin.limits.characters ) {
    const number = new Intl.NumberFormat().format( Linkedin.limits.characters );
    Draft.pushAlert(
      `LinkedIn does not accept posts with more than ${ number } characters. (post ${index + 1})`
    );
    return false;
  }
  
  if ( (content == null) || (content === "") ) {
    Draft.pushAlert(
      `LinkedIn does not allow empty post content. (post ${index + 1})`
    );
    return false;
  }

  return true;
};

Linkedin.validateThread = ( draft ) => {
  const thread = extract( "linkedin", draft );
  for ( const element of thread ) {
    if ( !Linkedin.validateThreadElement( element ) ){
      return false;
    }
  }

  return true;
};


Linkedin.validate = ( draft ) => {
  if ( !Identity.hasLinkedin() ) {
    return true;
  }

  if ( !Linkedin.validateThread( draft )) {
    return false;
  }

  if ( !Linkedin.validateAttachments( draft )) {
    return false;
  }

  return true;
};

export {
  Linkedin
}