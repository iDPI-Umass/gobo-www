<script>
  import PostAction from "$lib/components/PostAction.svelte";
  import { goto } from "$app/navigation";
  import { Cache } from "$lib/resources/cache.js";
  import * as PostEdge from "$lib/resources/post-edge.js";
  import { draftStore } from "$lib/stores/post-draft.js";

  export let identity;
  export let post;
  export let platform;
  export let marginBottom = "0.5rem";

  const proxyActionTable = {
    "bluesky": [ "reply", "repost", "quote", "like" ],
    "mastodon": [ "reply", "repost", "like" ],
    "reddit": [ "upvote", "downvote", "reply" ]
  };

  let toggles = [ "like", "repost", "upvote", "downvote" ];

  let proxyActions = proxyActionTable[ platform ];
  let edges = Cache.getPostEdge( identity, post );

  const refresh = function () {
    proxyActions = [ ...proxyActions ];
  }

  const toggleEdge = async function ( name ) {
    // Then make request, but invert conditional.
    if ( edges.has(name) ) {
      edges.delete( name );
      await PostEdge.remove({ identity, post, name });
    } else {
      edges.add( name );
      await PostEdge.put({ identity, post, name });
    }
    refresh();
  };

  const isVoteInterlock = function ( name ) {
    return ( edges.has(name) !== true ) && 
      (
        ( name === "upvote" && edges.has("downvote") ) ||
        ( name === "downvote" && edges.has("upvote") )
      );
  };

  const handle = async function ( event ) {
    const { name } = event.detail;

    // The interlock condition is when you use a counter-vote to create two
    // state changes. Removing one edge and adding another. We also need to
    // signal to the parent component that the parent should refresh.
    if ( isVoteInterlock(name) ) {
      await toggleEdge( "upvote" );
      await toggleEdge( "downvote" );
      return refresh();
    }

    if ( toggles.includes(name) ) {
      await toggleEdge( name );
    } else if ( name === "quote" ) {
      draftStore.update({
        quote: { identity, id: post },
        reply: null
      });
      goto( "/new-post" );
    } else if ( name === "reply" ) {
      draftStore.update({
        quote: null,
        reply: { identity, id: post }
      });
      goto( "/new-post" );
    } else {
      throw new Error(`no action defined for ${ name }`);
    }
    
  };

</script>

<section style:--bottom-margin={marginBottom}>
  {#each proxyActions as name}
    <PostAction
      on:toggle={handle} 
      {name}
      isActive={edges.has(name)}>
    </PostAction>
  {/each}
</section>

<style>
  section {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    height: 2rem;
    margin-top: var(--gobo-height-spacer-flex);
    margin-bottom: var(--bottom-margin);
  }
</style>


