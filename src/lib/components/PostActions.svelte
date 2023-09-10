<script>
  import PostAction from "$lib/components/PostAction.svelte";

  export let platform;
  export let marginBottom = "0.5rem";

  const proxyActionTable = {
    "bluesky": [ "reply", "repost", "quote", "like" ],
    "mastodon": [ "reply", "repost", "like" ],
    "reddit": [ "upvote", "downvote", "reply" ]
  };

  const proxyActions = proxyActionTable[ platform ];

</script>

<section style:--bottom-margin={marginBottom}>
  {#each proxyActions as action}
    <PostAction {platform} {action}></PostAction>
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


