<script>
  import Post from "$lib/components/Post.svelte"
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { guard } from "$lib/helpers/guard";
  import { getPost } from "$lib/resources/post.js";
  
  export let data;
  
  const fullPage = true;
  let post;
  let identity = data.bindings.identity;

  const loadPost = async function () {
    post = await getPost( data.bindings );
    console.log( post );
  };
  
  guard();
</script>

<div class="main-child">
  <BackLink heading="Post"></BackLink>

  {#await loadPost()}
    <Spinner></Spinner>
  {:then}
    <Post {identity} {...post} {fullPage}></Post>
  {:catch}
    <!-- TODO: We need something here for 404 reponses to post graphs. -->
    <p>This post is not available.</p>
  {/await}
  
</div>
