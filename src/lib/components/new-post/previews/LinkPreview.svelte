<script>
  import { onMount } from "svelte";
  import { State } from "$lib/engines/draft.js";
  import { Preview } from "$lib/engines/link-preview.js";

  export let previewURL;
  export let height;

  let card;
  const Render = State.make();
  Render.cleanup = () => {
    card = null;
  };

  Render.card = async () => {
    let preview = await Preview.fetch( previewURL );
    preview ??= {};
    if ( preview.url == null ) {
      card = null;
    } else {
      card = preview;
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
      <div class="image-frame" style:height={height}>
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src={card.image}/>
      </div>
    {/if}

    <section>
      <header>
        <h2>{card.title}</h2>
        <p>{card.url}</p>
      </header>
      <p>{card.description}</p>
    </section>
  </div>
{/if}


<style>
  .outer {
    border: var(--gobo-border-panel);
    border-radius: 0.5rem;
    overflow: hidden;
    color: #000;
    max-width: 100%;
    margin-bottom: 1.5rem;
  }

  .outer .image-frame {
    width: 100%;
  }

  .outer .image-frame img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  section {
    padding: 0.5rem;
  }

  .outer section > header > h2 {
    font-size: 1rem;
    font-weight: var(--gobo-font-weight-bold);
    margin: 0;
  }

  .outer section header p {
    font-size: 0.9rem;
    font-weight: var(--gobo-font-weight-light);
    color: #333;
    overflow-x: hidden;
    text-wrap: nowrap;
    text-overflow: ellipsis;
    margin: 0;
  }

  .outer section > p {
    font-size: 0.9rem;
    font-weight: var(--gobo-font-weight-regular);
    margin: 0;
  }
</style>