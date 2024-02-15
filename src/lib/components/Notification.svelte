<script>
  import Post from "$lib/components/Post.svelte";
  import Source from "$lib/components/NotificationSource.svelte";
  import { Cache } from "$lib/resources/cache.js";

  export let identity;

  export let id;
  export let platform;
  export let platform_id;
  export let base_url;
  export let type;
  export let active = null;
  export let notified;
  export let source_id;
  export let post_id = null;
  export let created;
  export let updated;
  let unused = [ 
    id,
    platform,
    platform_id,
    base_url,
    active,
    created, 
    updated 
  ];
  
  
  let source = Cache.getSource( source_id );
  let post = null;
  if ( post_id != null ) {
    post = Cache.getPost( post_id );
  }

  let hideSource = [
    "mention",
    "poll complete",
    "quote",
    "reply"
  ];

</script>


<section>
  <header>
    <p>{type}</p>
  </header>
  
  {#if !hideSource.includes(type)}
    <Source {notified} {...source}></Source>
  {/if}

  {#if post != null}
    <Post {identity} {...post}></Post>
  {/if}
</section>

<style>
  section {
    width: 100%;
    margin-top: 2.5rem;
  }

  section:first-child {
    margin-top: 0;
  }

  header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  p {
    text-transform: capitalize;
    padding: 0.25rem 1.5rem;
    border-radius: var(--sl-border-radius-pill);
    background-color: var(--gobo-color-primary);
  }

</style>


