<script>
  import Post from "$lib/components/Post.svelte"
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  
  export let data;  
</script>

<div class="main-child">
  <BackLink heading="Post"></BackLink>

  <Post
    identity={data.bindings.identity}
    id={data.bindings.id}
    fullPage={true}>
  </Post>  
</div>
