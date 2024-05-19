<script>
  import "@shoelace-style/shoelace/dist/components/alert/alert.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";

  export let delivery;


  let title, content;
  const Render = State.make();

  Render.cleanup = () => {
    title = null;
    content = "";
  };

  Render.content = () => {
    title = delivery.proof?.title;
    content = delivery.proof?.content ?? "";
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
</style>