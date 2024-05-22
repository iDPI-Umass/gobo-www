<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import Badge from "$lib/components/delivery/Badge.svelte";
  import { onMount, createEventDispatcher } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Name } from "$lib/engines/draft.js";
  import { DeliveryTarget } from "$lib/engines/delivery/index.js";

  export let target;

  const dispatch = createEventDispatcher();

  let unpublishButton;
  const Render = State.make();

  Render.cleanup = () => {
  };

  Render.target = () => {
  };


  const Handle = {};

  Handle.unpublish = async () => {
    if ( unpublishButton.loading === true ) {
      return;
    }

    unpublishButton.loading = true;
    try {
      await DeliveryTarget.unpublish( target );
      dispatch( "unpublish", {} );
    } catch ( error ) {
      console.error( error );
    }
    unpublishButton.loading = false;
  }


  Render.reset();
  onMount(() => {
    return () => {
      Render.reset();
    };
  });

  $: Render.target( target );
</script>



<div class="table-row">
  <div class="platform">
    <sl-icon 
      src="/icons/{target.identity.platform}.svg" 
      class={target.identity.platform} />
    
    <p>
      {#each Name.split(target.identity.prettyName) as part}
        <span>{ part }</span>
      {/each}
    </p>
  
  </div>

  {#if target.state === "pending"}
    <Badge label="Pending" family="neutral"/>
  {:else if target.state === "delivered"}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <sl-button
      bind:this={unpublishButton}
      on:click={Handle.unpublish}
      size="large"
      circle>
    
      <sl-icon
        src="/icons/trash.svg"
        label="Unpublish Post" 
        class="danger"/>

    </sl-button>
  
    <Badge label="Delivered" family="success"/>
  {:else if target.state === "error"}
    <Badge label="Failure" family="danger"/>
  {:else if target.state === "unpublished"}
    <Badge label="Deleted" family="inert"/>
  {/if}
    
</div>




<style>
  .table-row {
    display: flex;
    gap: 1rem;
  }

  .table-row .platform {
    flex: 1 1 auto;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .table-row > .platform > p {
    margin: 0;
  }

  .table-row sl-icon {
    font-size: 1.5rem;
  }

  sl-button::part(base) {
    background: none;
    border: none;
  }

  sl-button::part(label) {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>