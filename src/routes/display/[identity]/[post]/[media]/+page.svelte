<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { replaceState } from "$app/navigation";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Post } from "$lib/engines/post.js";
  import { isImage, isVideo } from "$lib/helpers/type.js";
  
  export let data;
  
  let state, bindings, post, attachments, media, show;
  const Render = State.make();
  Render.cleanup = () => {
    state = "loading";
    bindings = {};
    post = null;
    attachments = [];
    media = {};
    show = {};
  };

  Render.bindings = async ( value ) => {
    bindings = {
      identity: value.identity,
      post: value.post,
      media: Number( value.media )
    };

    if ( post == null || post.id !== value.post ) {
      post = await Post.get({
        identity: bindings.identity,
        id: bindings.post
      });

      attachments = post
        .attachments
        .filter( a => /^(image|video)\//.test(a.type) );
    }

    Render.page();
  };

  Render.page = () => {
    Render.media();
    if ( state === "error" ) {
      return;
    }
    Render.nav();
    state = "ready";
  };

  Render.media = () => {
    if ( post == null ) {
      state = "error";
      return;
    }

    const match = attachments[ bindings.media ];
    if ( match == null ) {
      state = "error";
      return;
    }
    
    media = match;
  };

  Render.nav = async () => {
    if ( attachments.length <= 1 ) {
      show = { left: false, right: false };
      return;
    }

    const current = bindings.media;
    let left, right;
    if ( current === 0 ) {
      left = false;
    }
    if ( current >= (attachments.length - 1) ) {
      right = false;
    }

    left ??= true;
    right ??= true;
    show = { left, right };
  };


  const Handle = {};

  Handle.keydown = ( event ) => {
    if ( state === "loading" ) {
      return;
    }

    if ( (event.key === "ArrowLeft") && (show.left === true) ) {
      state = "loading";
      Handle.left();
    }
    if ( (event.key === "ArrowRight") && (show.right === true) ) {
      state = "loading";
      Handle.right();
    }
  };

  Handle.buildPath = () => {
    const { identity, post, media } = bindings;
    return `/display/${ identity }/${ post }/${ media }`
  };

  Handle.left = () => {
    bindings.media -= 1;
    replaceState( Handle.buildPath() );
    Render.page();
  };

  Handle.right = () => {
    bindings.media += 1;
    replaceState( Handle.buildPath() );
    Render.page();
  };


  Render.reset();
  onMount(() => {
    document.addEventListener( "keydown", Handle.keydown );
    return () => {
      document.removeEventListener( "keydown", Handle.keydown );
      Render.reset();
    };
  });

  $: Render.bindings( data.bindings );
</script>


<div class="outer">
  <BackLink heading="Media"></BackLink>

  {#if state === "error"}
    <p>There was a problem loading this media</p>
  
  {:else if state === "loading"}
    <Spinner></Spinner>
  
  {:else if state === "ready"}
    <div class="frame">
      {#if isImage( media )}
        <img 
          src="{ media.url }"
          alt="full size">
      {:else if isVideo( media )}
        <!-- svelte-ignore a11y-media-has-caption -->
        <video loop controls>
          <source 
            src={ media.url }
            type={ media.type }>
        </video>
      {/if}

      <nav>
        {#if show.left === true}
          <sl-button
            on:click={Handle.left}
            class="left">
            <div class="chevron-circle">
              <sl-icon src="/icons/chevron-left.svg"></sl-icon>
            </div>
            
          </sl-button>
        {/if}
        
        {#if show.right === true}
          <sl-button 
            on:click={Handle.right}
            class="right">
            <div class="chevron-circle">
              <sl-icon src="/icons/chevron-right.svg"></sl-icon>
            </div>
          </sl-button>
        {/if}
      </nav>
    </div>
  
  {/if}

</div>




<style>
  .outer {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .frame {
    margin-top: var(--gobo-height-spacer-flex);
    min-height: 0;
    flex: 1 1 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: 50% 50%;
  }

  video {
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: 50% 50%;
  }

  nav {
    --button-width: 5rem;
    --button-height: 20rem;
    --frame-height: calc( 100vh - 6rem )
  }

  nav sl-button {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 2;
  }

  nav sl-button.left {
    left: -0.75rem;
  }

  nav sl-button.right {
    right: -0.75rem;
  }

  nav sl-button::part(base) {
    width: var(--button-width);
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    border: none;
  }

  nav sl-button:hover::part(base) {
    border: none;
  }

  nav sl-button::part(label) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0;
    width: 100%;
  }

  nav sl-button.left::part(label) {
    align-items: start;
  }

  nav sl-button.right::part(label) {
    align-items: end;
  }

  nav .chevron-circle {
    background-color: rgba(0, 0, 0, 0.5);
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  nav sl-button.left .chevron-circle sl-icon {
    margin-right: 2px;
  }

  nav sl-button.right .chevron-circle sl-icon {
    margin-left: 2px;
  }

  nav sl-button sl-icon {
    font-size: 1.125rem;
    color: rgba(255, 255, 255, 1)
  }

  @media( min-width: 768px ) {
    nav sl-button.left {
      left: 0rem;
    }

    nav sl-button.right {
      right: 0rem;
    }

    nav .chevron-circle {
      width: 2.4rem;
      height: 2.4rem;
    }

    nav sl-button sl-icon {
      font-size: 1.5rem;
    }
  }
</style>