<script>
  import Post from "$lib/components/Post.svelte";
  import posts from "./posts.js";
</script>


<section>
  <h1>Home Feed</h1>
  {#each posts as post (post.id)}
    <Post {...post}></Post>
  {/each}
</section>

<style>
  h1 {
    font-size: var(--sl-font-size-x-large);
  }
</style>