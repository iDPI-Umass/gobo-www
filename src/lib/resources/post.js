import { getGOBOClient, logout } from "$lib/helpers/account";
import { Cache } from "$lib/resources/cache.js";
import * as Draft from "$lib/resources/draft-image.js";
import * as FeedSaver from "$lib/engines/feed-singleton.js";
import { RichText, BskyAgent, UnicodeString } from "@atproto/api"

const agent = new BskyAgent({ service: "https://bsky.app"});

const shortURL = function (url) {
  const url_ = new URL(url);
  const path =
    (url_.pathname === '/' ? '' : url_.pathname) + url_.search + url_.hash
  if (path.length > 15) {
    return url_.host + path.slice(0, 13) + '...'
  }
  return url_.host + path
}

const get = async function ({ identity, id }) {
  if ( Cache.hasPostCenter(id) ) {
    return Cache.getPost( id );
  }

  let graph, weave;
  try {
    const client = await getGOBOClient();
    graph = await client.personIdentityPost.get({ 
      person_id: client.id,
      identity_id: identity,
      id 
    });

  } catch (error) {
    if ( error.status === 401 ) {
      await logout();
      return {};
    } else {
      throw error;
    }
  }

  try {
    const engine = await FeedSaver.getEngine();
    const filterEngine = engine.filterEngine;
    filterEngine.filterPrimary( graph );
    console.log( "filtered graph", graph );
  
    weave = filterEngine.weaveGraph( graph );
    filterEngine.filterTraversals( weave );
    Cache.mergeWeave({ id: identity }, weave );
  
    return weave.posts[ weave.feed[0] ];
  } catch (error) {
    console.error(error);
  }
};

const buildMetadata = async function ( identity, draft ) {
  const { options } = draft;

  switch ( identity.platform ) {
    case "bluesky":
      let facets = [];
      let text = "";
      if ( draft.content != null ) {
        const rt = new RichText({ text: draft.content });
        await rt.detectFacets( agent );
        facets = rt.facets ?? [];
        for (const facet of facets) { 
          if (facet.features.find(
            f => f.$type === 'app.bsky.richtext.facet#link',
          )){
            const { byteStart, byteEnd } = facet.index;
            const url = rt.unicodeText.slice(byteStart, byteEnd);
            const shortened = new UnicodeString(shortURL(url));
            // insert the shortened URL
            rt.insert(byteStart, shortened.utf16);
            // update the facet to cover the new shortened URL
            facet.index.byteStart = byteStart;
            facet.index.byteEnd = byteStart + shortened.length;
            // remove the old URL
            rt.delete(byteStart + shortened.length, byteEnd + shortened.length);
          }
        }
        text = rt.text;
      }
      return {
        reply: draft.reply?.data ?? undefined,
        quote: draft.quote?.data ?? undefined,
        facets: facets,
        text: text
      }
    case "mastodon":
      return {
        sensitive: options.sensitive,
        spoiler: options.spoilerText,
        reply: draft.reply?.data ?? undefined
      }
    case "reddit":
      return {
        title: options.title,
        subreddit: options.subreddit,
        nsfw: options.sensitive,
        spoiler: options.spoiler,
        reply: draft.reply?.data ?? undefined
      }
    case "smalltown":
      return {
        sensitive: options.sensitive,
        spoiler: options.spoilerText,
        reply: draft.reply?.data ?? undefined
      }
    default:
      throw new Error("unknown platform type");
  }
};

const uploadAttachments = async function ( attachments ) {
  const draftIDs = [];
  for ( const attachment of attachments ) {
    const draft = await Draft.create( attachment );
    draftIDs.push( draft.id );
  }
  return draftIDs;
};

const publish = async function ( draft ) {
  const options = draft.options ?? {};

  const post = {};
  post.content = draft.content;
  post.title = options.title ?? undefined;
  post.attachments = await uploadAttachments( draft.attachments );
  // post.poll = {};

  const targets = [];
  for ( const identity of draft.identities ) {
    if ( identity.active === true ) {
      targets.push({
        identity: identity.id,
        metadata: await buildMetadata( identity, draft )
      });
    }
  }

  const client = await getGOBOClient();
  await client.personPosts.post({ 
    parameters: {
      person_id: client.id
    },
    content: { post, targets }   
  });
};

export {
  get,
  publish
}