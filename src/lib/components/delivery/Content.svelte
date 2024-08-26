<script>
  import "@shoelace-style/shoelace/dist/components/alert/alert.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";

  export let delivery;

  const parser = new DOMParser();
  const serializer = new XMLSerializer();

  let title, content;
  const Render = State.make();

  Render.cleanup = () => {
    title = null;
    content = "";
  };

  // Currently, we parse the thread state stored in the content to get out the
  // threadpoints and manually add the sl-icons. However, there's an issue
  // with sharing adopted stylesheets that complicates this document fragment
  // parsing strategy.
  //
  // TODO: How do we improve this to be not so hacky?
  Render.content = () => {
    title = delivery.proof?.title;
    const raw = delivery.proof?.content ?? "";
    const dom = parser.parseFromString( 
      `<div id='outermost'> ${raw} </div>`, 
      "text/html"
    );
    
    const threadpoints = dom.querySelectorAll( "span.threadpoint" );
    for ( const el of threadpoints ) {
      const platform = el.dataset.platform;
      if (!platform) {
        continue
      }
      const icon = document.createElement( "gobo-replace-span" );
      icon.classList.add( "content" );
      icon.classList.add( platform );
      icon.setAttribute( "src", `/icons/${platform}.svg` );
      el.appendChild( icon );
    }

    const mentions = dom.querySelectorAll( "span.mention" );
    for ( const el of mentions ) {
      const icon = document.createElement( "gobo-replace-span" );
      icon.classList.add( "content" );
      icon.classList.add( "filled" );
      icon.setAttribute( "src", `/icons/at.svg` );
      el.appendChild( icon );
    }

    content = serializer
      .serializeToString( dom.querySelector( "div#outermost" ))
      .replaceAll( "gobo-replace-span", "sl-icon" );
  };


  Render.reset();
  onMount(() => {
    Render.content();
    return () => {
      Render.reset();
    };
  });

  $: Render.content( delivery );
</script>


{#if content?.length > 0 }
  <section>
    {#if title}
      <h2>{title}</h2>
    {/if}

    {#if content}
      {@html content}
    {/if}
  </section>
{/if}


<style>
  :global(sl-icon.content) {
    padding: 0.1rem 0.25rem;
    border-radius: 0.25rem;
    margin-bottom: -0.2rem;
  }

  :global(sl-icon.content.filled) {
    background: var(--gobo-color-primary);
  }
</style>