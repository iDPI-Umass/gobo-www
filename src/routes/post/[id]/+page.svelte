<script>
  import posts from "$lib/stores/posts.js";
  import Post from "$lib/components/Post.svelte"
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import { guard } from "$lib/helpers/guard";
  export let data;
  let fullPage = true;

  const id = Number( data.bindings.id );
  let post = posts.find( post => post.id === id );
  if ( post == null ) {
    post = {};
  }

  guard();
</script>

<div class="main-child">
  <BackLink
    href="/home"
    heading="Post">
  </BackLink>

  <Post {...post} {fullPage}></Post>
</div>
