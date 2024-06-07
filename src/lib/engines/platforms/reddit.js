import { Draft, Identity } from "$lib/engines/draft.js";
import { extract } from "./helpers.js";


const Reddit = {};

Reddit.limits = {
  characters: 40000,
  attachments: 20,
  image: {
    types: [
      "image/gif",
      "image/heic",
      "image/heif",
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
    size: 20000000  // 20 MB
  },

  video: {
    types: [
      "video/mp4",
      "video/quicktime",
    ],
    size: 20000000  // 20 MB
  }
};

Reddit.contentLength = ( content ) => {
  return content?.length ?? 0;
};

Reddit.buildItem = async ( draft, item ) => {
  const title = draft.options.general.title;
  const subreddit = draft.options.reddit.subreddit;
  const spoiler = draft.options.reddit.spoiler;
  const nsfw = draft.options.attachments.sensitive;

  item.metadata ??= {};
  Object.assign( item.metadata, {
    title,
    subreddit,
    spoiler,
    nsfw
  });
};

Reddit.build = async ( draft ) => {
  const thread = extract( "reddit", draft );

  thread[0].metadata ??= {};
  if ( draft.reply?.data != null ) {
    const id = draft.reply.data.feed[0];
    thread[0].metadata.reply = draft.reply.data.posts.find( p => p.id == id );
  }

  for ( const item of thread ) {
    await Reddit.buildItem( draft, item );
  }

  return thread;
};


const Validate = {};

Validate.image = ( attachment ) => {
  const limits = Reddit.limits.image

  const type = attachment.type;
  if ( !limits.types.includes(type) ) {
    Draft.pushAlert(
      `Reddit does not accept images of type ${ type }`
    );
    return false;
  }
  
  const size = attachment.size;
  if ( size > limits.size ) {
    Draft.pushAlert(
      `Reddit does not accept image files larger than ${filesize( limits.size )}`
    )
    return false;
  }

  return true;
};

Validate.video = ( attachment ) => {
  const limits = Reddit.limits.video

  const type = attachment.type;
  if ( !limits.types.includes(type) ) {
    Draft.pushAlert(
      `Reddit does not accept video of type ${ type }`
    );
    return false;
  }
  
  const size = attachment.size;
  if ( size > limits.size ) {
    Draft.pushAlert(
      `Reddit does not accept video files larger than ${filesize( limits.size )}`
    )
    return false;
  }

  return true;
};


Reddit.validateAttachments = ( draft ) => {
  if ( draft.attachments.length > Reddit.limits.attachments ) {
    Draft.pushAlert(
      `Reddit does not allow more than ${Reddit.limits.attachments} attachments per post.`
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
        `Reddit does not support type ${ attachment.type }`
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
      `Reddit requires that video posts have no other attachments.`
    );
    return false;
  }

  return true;
};

Reddit.validateOptions = ( draft ) => {
  const options = draft.options.reddit;
  if ( !options.subreddit ) {
    Draft.pushAlert(
      `Please specify the subreddit for this Reddit post.`
    );
    return false;
  }

  if ( !draft.options.general.title ) {
    Draft.pushAlert(
      `Please provide a title for this Reddit post.`
    );
    return false;
  }

  return true;
};

Reddit.validateThreadElement = ( element ) => {
  const { index, content } = element;
  
  if ( Reddit.contentLength(content) > Reddit.limits.characters ) {
    const number = new Intl.NumberFormat().format( Reddit.limits.characters );
    Draft.pushAlert(
      `Reddit does not accept posts with more than ${ number } characters. (post ${index + 1})`
    );
    return false;
  }
  
  if ( (content == null) || (content === "") ) {
    Draft.pushAlert(
      `Reddit does not allow empty post content. (post ${index + 1})`
    );
    return false;
  }

  return true;
};

Reddit.validateThread = ( draft ) => {
  const thread = extract( "reddit", draft );
  for ( const element of thread ) {
    if ( !Reddit.validateThreadElement( element ) ){
      return false;
    }
  }

  return true;
};


Reddit.validate = ( draft ) => {
  if ( !Identity.hasReddit() ) {
    return true;
  }

  if ( !Reddit.validateOptions( draft )) {
    return false;
  }

  if ( !Reddit.validateThread( draft )) {
    return false;
  }

  if ( !Reddit.validateAttachments( draft )) {
    return false;
  }

  return true;
};


export {
  Reddit
}