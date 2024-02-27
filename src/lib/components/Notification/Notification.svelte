<script>
  import Post from "$lib/components/Post.svelte";
  import Frame from "$lib/components/Notification/Frame.svelte";
  import Icon from "$lib/components/Notification/Icon.svelte";
  import Action from "$lib/components/Notification/Action.svelte"
  import Footer from "$lib/components/Notification/Footer.svelte";
  import Content from "$lib/components/Post/Content.svelte";
  import { Cache } from "$lib/resources/cache.js";


  export let identity;
  export let baseURL;
  export let notification;

  let source = Cache.getSource( notification.source_id );
  let post = null;
  if ( notification.post_id != null ) {
    post = Cache.getPost( notification.post_id ) ?? {};
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
    "follow",
    "direct message"
  ];

  let contentStyles = {
    marginTop: "1rem",
    maxHeight: "10rem"
  };

</script>

{#if showPost.includes( notification.type )}
  <section>
    <Post {identity} {...post} showWhy={false}></Post>
  </section>

{:else if attributed.includes( notification.type )}
  <Frame>
    <Icon slot="gutter" name={notification.type}></Icon>
    <div slot="content" class="attributed">
      <Action {source} {notification}></Action>
      {#if post != null}
        <Content
          title={post?.title}
          content={post?.content}
          styles={contentStyles}
        ></Content>
      {/if}
    </div>
    <Footer slot="footer" {baseURL} {notification} {source} {post} ></Footer>
  </Frame>

{:else}
  <Frame>
    <Icon slot="gutter" name={notification.type}></Icon>
    <p slot="content">Unable to render {notification.type} notification.</p>
  </Frame>
{/if}



<style>
  section {
    width: 100%;
    margin-top: var(--gobo-height-spacer);
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


