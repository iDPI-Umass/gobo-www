import { getGOBOClient, logout } from "$lib/helpers/account";
import { Cache } from "$lib/resources/cache.js";
import * as Draft from "$lib/resources/draft-image.js";
import * as FeedSaver from "$lib/engines/feed-singleton.js";

const getPost = async function ({ identity, id }) {
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
    Cache.mergeWeave( {id: identity}, weave );
  
    return weave.posts[ weave.feed[0] ];
  } catch (error) {
    console.error(error);
  }
};

const buildMetadata = function ( identity, draft ) {
  const { options } = draft;

  switch ( identity.platform ) {
    case "bluesky":
      return {
        reply: draft.reply?.data ?? undefined,
        quote: draft.quote?.data ?? undefined
      };
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
        metadata: buildMetadata( identity, draft )
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
  getPost,
  publish
}