import { Draft, Identity } from "$lib/engines/draft.js";


const Reddit = {};

Reddit.limits = {
  characters: 40000,
  attachments: 20,
  images: {
    types: [
      "image/gif",
      "image/heic",
      "image/heif",
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
    size: 20000000  // 20 MB
  }
};

Reddit.contentLength = () => {
  const draft = Draft.read();
  return draft.content?.length ?? 0;
};

Reddit.build = ( draft ) => {
  let reply;
  if ( draft.reply?.data != null ) {
    const id = draft.reply.data.feed[0];
    reply = draft.reply.data.posts.find( p => p.id == id );
  }

  return {
    subreddit: draft.options.reddit.subreddit,
    spoiler: draft.options.reddit.spoiler,
    nsfw: draft.options.attachments.sensitive,
    reply
  };
};


Reddit.validateAttachments = ( draft ) => {
  const limits = Reddit.limits.images;
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
        `Reddit does not accept attachments of type ${ type }`
      );
      return false;
    }

    const size = attachment.file.size;
    if ( size > limits.size ) {
      Draft.pushAlert(
        `Reddit does not accept attachments larger than ${filesize( limits.size )}`
      )
      return false;
    }
  }
  return true;
};


Reddit.validate = ( draft ) => {
  if ( !Identity.hasReddit() ) {
    return true;
  }

  if ( Reddit.contentLength() > Reddit.limits.characters ) {
    const number = new Intl.NumberFormat().format( Reddit.limits.characters );
    Draft.pushAlert(
      `Reddit does not accept posts with more than ${ number } characters.`
    );
    return false;
  }

  if ( (draft.content == null) || (draft.content === "") ) {
    Draft.pushAlert(
      `Reddit does not allow empty post content.`
    );
    return false;
  }

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

  if ( draft.attachments.length > Reddit.limits.attachments ) {
    Draft.pushAlert(
      `Reddit does not allow more than ${Reddit.limits.attachments} attachments per post.`
    );
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