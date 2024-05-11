<script>
  import { filesize } from "filesize";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Delivery } from "$lib/engines/platforms/publish";
  import * as deliveryStore from "$lib/stores/delivery.js";

  let uploads;
  const Render = State.make();

  Render.cleanup = () => {
    uploads = [];
  };

  Render.uploads = ( value ) => {
    uploads = value;
  };


  const Handle = {};


  Render.reset();
  onMount(() => {
    Render.listen( deliveryStore.uploads, Render.uploads );
    return () => {
      Render.reset();
    };
  });
</script>


{#if uploads.length > 0 }
  <h2>Uploads</h2>

  <div class="gobo-table">
    {#each uploads as upload (upload.file.name)}
      <div class="table-row">
        <div class="metadata">
          <p>
            { upload.file.name }
          </p>
          <p>
            Size: {filesize( upload.file.size )}
          </p>
        </div>

        {#if upload.state === "pending"}
          <Spinner size="1.5rem"></Spinner>
        {:else if upload.state === "uploaded"}
          <sl-icon src="/icons/check2-circle.svg" class="success" />
        {:else if upload.state === "error"}
          <sl-icon src="/icons/exclamation-octagon.svg" class="danger" />
        {:else if upload.state === "aborted"}
          <sl-icon src="/icons/exclamation-triangle.svg" />
        {/if}
        
        
      </div>
    {/each}
  </div>
{/if}



<style>
  .gobo-table {
    min-height: 3rem;
    margin-top: var(--gobo-height-spacer-flex);
  }

  .table-row {
    display: flex;
    gap: 1rem;
  }

  .table-row > .metadata {
    flex: 1 1 100%;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    justify-content: start;
    align-items: start;
  }

  .table-row > .metadata > p {
    word-break: break-all;
    font-size: 1rem !important;
    margin: 0 !important;
  }

  .table-row sl-icon {
    font-size: 1.5rem;
  }
</style>