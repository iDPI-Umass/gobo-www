import { Draft, Identity } from "$lib/engines/draft.js";
import { Mastodon } from "$lib/engines/platforms/mastodon.js";


const Smalltown = {};

Smalltown.limits = {
  characters: 500,
  attachments: 4,
  images: {
    types: [],
    size: 1
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

  if ( draft.attachments.length > Smalltown.limits.attachments ) {
    Draft.pushAlert(
      `Smalltown does not allow more than ${Smalltown.limits.attachments} attachments per post.`
    );
    return false;
  }

  return true;
};

export {
  Smalltown
}