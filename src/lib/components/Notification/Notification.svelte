<script>
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import Post from "$lib/components/Post.svelte";
  import Frame from "$lib/components/Notification/Frame.svelte";
  import Icon from "$lib/components/Notification/Icon.svelte";
  import Action from "$lib/components/Notification/Action.svelte"
  import Footer from "$lib/components/Notification/Footer.svelte";
  import Content from "$lib/components/Notification/Content.svelte";
  import DirectMessageAction from "$lib/components/Notification/DirectMessageAction.svelte";
  import DirectMessageFooter from "$lib/components/Notification/DirectMessageFooter.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Notification } from "$lib/engines/notification.js";

  export let identity;
  export let notification;

  let state, post, source, glamor;
  const Render = State.make();
  Render.cleanup = () => {
    state = "loading";
    post = null;
    source = null;
    glamor = null;
  };

  Render.notification = async () => {
    if ( identity == null ) {
      console.error("render notification: identity is null");
      state = "error";
      return;
    }

    if ( notification.source_id == null ) {
      console.error("render notification: source ID is null");
      state = "error";
      return;
    }

    source = Notification.source( notification );
    if ( source == null ) {
      state = "error";
      return;
    }

    post = notification.post_id;

    if ( Conditions.isDirectMessage( notification )) {
      glamor = "direct message";
    } else if ( Conditions.showPost.includes( notification.type )) {
      glamor = "post";
    } else if ( Conditions.attributed.includes( notification.type )) {
      glamor = "attribution";
    } else if ( Conditions.attributedPost.includes( notification.type )) {
      glamor = "attribution with post";
    } else {
      glamor = "error";
    }

    state = "ready";
  };


  const Conditions = {};
  
  Conditions.isDirectMessage = ( notification ) => {
    return (notification.type === "direct message") || 
      (notification.post_meta?.is_direct_message === true);
  };
  
  Conditions.showPost = [
    "quote",
    "reply",
    "mention",
    "poll complete"
  ];

  Conditions.attributed = [
    "follow"
  ];

  Conditions.attributedPost = [
    "repost",
    "like"
  ];

  const styles = {
    marginTop: "1rem",
    maxHeight: "10rem"
  };


  Render.reset();
  onMount(() => {
    Render.notification();
    return () => {
      Render.reset();
    }
  });
</script>


{#if state === "error"}
  <section>
    <p>There was a problem displaying this notification.</p>
  </section>

{:else if state === "loading"}
  <Spinner></Spinner>

{:else if state === "ready"}
  {#if glamor === "post"}
    <section>
      <Post {identity} id={post} showWhy={false}></Post>
    </section>

  {:else if glamor === "attribution"}
    <Frame>
      <Icon slot="gutter" name={notification.type}></Icon>
      <div slot="content" class="attributed">
        <Action {source} {notification}></Action>
      </div>
      <Footer slot="footer" {identity} {notification} {source} {post} ></Footer>
    </Frame>

  {:else if glamor === "attribution with post"}
    <Frame>
      <Icon slot="gutter" name={notification.type}></Icon>
      <div slot="content" class="attributed">
        <Action {source} {notification}></Action>
        <Content {identity} id={post} {styles}></Content>
      </div>
      <Footer slot="footer" {identity} {notification} {source} {post} ></Footer>
    </Frame>

  {:else if glamor === "direct message"}
    <Frame>
      <Icon slot="gutter" name={notification.type}></Icon>
      <div slot="content" class="attributed">
        <DirectMessageAction {source} {notification}/>
      </div>
      <DirectMessageFooter slot="footer" {identity} {notification} {source} />
    </Frame>

  {:else}
    <Frame>
      <Icon slot="gutter" name={notification.type}></Icon>
      <p slot="content">Unable to render {notification.type} notification.</p>
    </Frame>
  {/if}

{/if}

<style>
  section {
    width: 100%;
    margin-top: var(--gobo-height-spacer-flex);
    margin-bottom: 0;
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


