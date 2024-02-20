<script>
  import Post from "$lib/components/Post.svelte";
import Frame from "$lib/components/Notification/Frame.svelte";
  import Icon from "$lib/components/Notification/Icon.svelte";
  import Action from "$lib/components/Notification/Action.svelte"
  import Content from "$lib/components/Post/Content.svelte";
  import { Cache } from "$lib/resources/cache.js";
    import { attr } from "svelte/internal";

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
    post = Cache.getPost( post_id ) ?? {};
  }

  let showPost = [
    "quote",
    "reply",
    "mention",
    "poll complete"
  ];

  let attributed = [
    "repost",
    "like",
    "follow"
  ];

  let contentStyles = {
    marginTop: "1rem",
    maxHeight: "10rem"
  };

</script>

{#if showPost.includes( type )}
  <section>
    <Post {identity} {...post} showWhy={false}></Post>
  </section>

{:else if attributed.includes( type )}
  <Frame>
    <Icon slot="gutter" name={type}></Icon>
    <div slot="content" class="attributed">
      <Action {source} {type} {notified}></Action>
      {#if post != null}
        <Content
          title={post?.title}
          content={post?.content}
          styles={contentStyles}
        ></Content>
      {/if}
    </div>
  </Frame>

{:else}
  <Frame>
    <Icon slot="gutter" name={type}></Icon>
    <p slot="content">Unable to render {type} notification.</p>
  </Frame>
{/if}



<style>
  section {
    width: 100%;
    margin-top: 2.5rem;
  }

  section:first-child {
    margin-top: 0;
  }

  .attributed {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

</style>


