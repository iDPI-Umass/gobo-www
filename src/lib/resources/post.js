import { getGOBOClient, logout } from "$lib/helpers/account";
import { cache, Cache } from "$lib/resources/cache.js";
import * as Draft from "$lib/resources/draft-image.js";

const getPost = async function ( id ) {
  let post = Cache.getPost( id );
  if ( post != null ) {
    return post;
  }


  let result;
  try {
    const client = await getGOBOClient();
    result = await client.postGraph.get({ id });
  } catch (error) {
    if ( error.status === 401 ) {
      await logout();
      return {};
    } else {
      throw error;
    }
  }

  const posts = {};
  const sources = {};

  for ( const post of result.posts ) {
    posts[ post.id ] = post;
  }
  for ( const reply of result.replies ) {
    posts[ reply[0] ].reply = reply[1];
  }
  for ( const share of result.shares ) {
    posts[ share[0] ].shares ??= [];
    posts[ share[0] ].shares.push( share[1] );
  }
  for ( const source of result.sources ) {
    sources[ source.id ] = source;
  }
 

  Object.assign( cache.posts, posts );
  Object.assign( cache.sources, sources );
  
  return posts[ result.feed[0] ];
};

const buildMetadata = function ( identity, options ) {
  switch ( identity.type ) {
    case "bluesky":
      return {};
    case "mastodon":
      return {
        sensitive: options.sensitive,
        spoiler: options.spoilerText
      }
    case "reddit":
      return {
        title: options.title,
        subreddit: options.subreddit,
        nsfw: options.sensitive,
        spoiler: options.spoiler
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
    targets.push({
      identity: identity.id,
      metadata: buildMetadata( identity, options )
    });
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