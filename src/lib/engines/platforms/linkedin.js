import * as linkify from "linkifyjs";
import { Draft, Identity } from "$lib/engines/draft.js";


const Linkedin = {};

Linkedin.limits = {
  characters: 3000,
  attachments: 20,
  images: {
    types: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif"
    ],
    size: 104857600  // 100 MiB
  }
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
Linkedin.contentLength = () => {
  const draft = Draft.read();
  if ( draft.content == null ) {
    return 0;
  }

  const links = linkify.find( draft.content, "url" );
  let removed = 0;
  
  for ( const link of links ) {
    if ( link.href.length > 26 ) {
      removed += link.href.length - 26;
    }
  }
  
  return draft.content.length - removed;
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

Linkedin.build = async ( draft ) => {
  const linkCard = await Linkedin.buildCard( draft.linkPreview );

  return {
    visibility: Linkedin.buildVisibility( draft ),
    linkCard,
  };
};


Linkedin.validate = ( draft ) => {
  if ( !Identity.hasLinkedin() ) {
    return true;
  }

  if ( Linkedin.contentLength() > Linkedin.limits.characters ) {
    const number = new Intl.NumberFormat().format( Linkedin.limits.characters );
    Draft.pushAlert(
      `LinkedIn does not accept posts with more than ${ number } characters.`
    );
    return false;
  }

  if ( (draft.content == null) || (draft.content === "") ) {
    Draft.pushAlert(
      `LinkedIn does not allow empty post content.`
    );
    return false;
  }

  if ( draft.attachments.length > Linkedin.limits.attachments ) {
    Draft.pushAlert(
      `LinkedIn does not allow more than ${Linkedin.limits.attachments} attachments per post.`
    );
    return false;
  }

  return true;
};

export {
  Linkedin
}