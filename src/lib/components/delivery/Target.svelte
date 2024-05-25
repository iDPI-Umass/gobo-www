<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import Badge from "$lib/components/delivery/Badge.svelte";
  import { onMount, createEventDispatcher } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Name } from "$lib/engines/draft.js";
  import { DeliveryTarget } from "$lib/engines/delivery/index.js";

  export let target;

  const dispatch = createEventDispatcher();

  let state, unpublishButton;
  const Render = State.make();

  Render.cleanup = () => {
    state = "loading";
  };

  Render.target = () => {
    state = target.state;
  };


  const Handle = {};

  Handle.unpublish = async () => {
    if ( state === "loading" ) {
      return;
    }

    state = "loading";
    try {
      await DeliveryTarget.unpublish( target );
      dispatch( "unpublish", {} );
    } catch ( error ) {
      console.error( error );
    }
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

  {#if state === "loading"}
    <Badge loading={true} family="neutral"></Badge>
  
  {:else if state === "pending"}
    <Badge label="Pending" family="neutral"/>
  
  {:else if state === "delivered"}
    <div class="status">
      <div class="controls">
        {#if target.stash.url}
  
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <sl-icon-button
            href={target.stash.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            size="small"
            src="/icons/box-arrow-up-right.svg"
            label="View Post" 
            class="text" />
        {:else}
          <div class="spacer"></div>
        {/if}
  
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <sl-icon-button
          bind:this={unpublishButton}
          on:click={Handle.unpublish}
          size="small"
          src="/icons/trash.svg"
          label="Unpublish Post" 
          class="danger" >
        </sl-icon-button>
      </div>
    
      <Badge label="Delivered" family="success"/>
    </div>
  
  {:else if state === "error"}
    <Badge label="Failure" family="danger"/>
  
  {:else if state === "unpublished"}
    <Badge label="Deleted" family="inert"/>
  
  {/if}
    
</div>




<style>
  .table-row {
    display: flex;
    gap: var(--gobo-width-spacer);
  }

  .table-row .platform {
    flex: 1 1 max-content;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .table-row > .platform > sl-icon {
    font-size: 1.25rem;
    min-width: 1.25rem;
    min-height: 1.25rem;
  }
  .table-row > .platform > p {
    font-size: var(--gobo-font-size-detail);
    margin: 0;
    display: flex;
    flex-wrap: wrap;
  }

  .table-row .status {
    flex: 0 0 min-content;
    gap: var(--gobo-width-spacer-flex);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .table-row .controls {
    flex: 1 0 auto;
    display: flex;
    justify-content: space-between;
    gap: var(--gobo-width-spacer-flex);
    /* order: 1; */
  }

  .table-row sl-icon-button {
    font-size: 1rem;
  }
  .table-row sl-icon-button.danger::part(base),
  .table-row sl-icon-button.danger::part(base):hover {
    color: var(--gobo-color-danger);
  }
  .table-row sl-icon-button.text::part(base),
  .table-row sl-icon-button.text::part(base):hover {
    color: var(--gobo-color-text);
  }

  @media( min-width: 500px ) {
    .table-row .status {
      flex-wrap: nowrap;
      flex-basis: max-content;
    }

    /* .table-row .status .controls {
      order: 0;
    } */
  }
</style>