<script>
  import { onMount } from "svelte";
  import { State } from "$lib/engines/draft.js";
  import { Preview } from "$lib/engines/link-preview.js";

  export let previewURL;

  let card, domain;
  const Render = State.make();
  Render.cleanup = () => {
    card = null;
    domain = ""
  };

  Render.card = async () => {
    let preview = await Preview.fetch( previewURL );
    preview ??= {};
    if ( preview.url == null ) {
      card = null;
    } else {
      card = preview;
      try {
        let url = new URL( card.url );
        domain = url.hostname;
      } catch ( error ) {
        console.warn( error );
      }
    }
  };

  Render.reset();
  onMount(() => {
    return () => {
      Render.reset();
    };
  });

  $: Render.card( previewURL );
</script>


{#if card != null }
  <div class="outer">
    {#if card.image}
      <div class="image-frame">
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src={card.image}/>
      </div>
    {/if}

    <section>
      <header>
        <h2>{card.title}</h2>
      </header>
      <p>{domain} · x min read</p>
    </section>
  </div>
{/if}


<style>
  .outer {
    overflow: hidden;
    color: #000;
    max-width: 100%;
    margin-bottom: 1.5rem;
  }

  .outer .image-frame {
    height: 300px;
    width: 100%;
  }

  .outer .image-frame img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  section {
    padding: 0.5rem;
    background-color: rgb(238, 243, 247);
  }

  .outer section > header > h2 {
    color: #000;
    font-size: 1rem;
    font-weight: var(--gobo-font-weight-bold);
    margin: 0;
  }

  .outer section p {
    font-size: 12px;
    color: rgb(0, 0, 0, 0.6);
  }
</style>