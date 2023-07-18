<script>
  import Post from "$lib/components/Post.svelte"
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { guard } from "$lib/helpers/guard";
  import { getPost } from "$lib/resources/post.js";
  
  export let data;
  
  const fullPage = true;
  let post;

  const loadPost = async function () {
    post = await getPost( data.bindings.id );
  };
  
  guard();
</script>

<div class="main-child">
  <BackLink
    href="/home"
    heading="Post">
  </BackLink>

  {#await loadPost()}
    <Spinner></Spinner>
  {:then}
    <Post {...post} {fullPage}></Post>
  {/await}
  
</div>
