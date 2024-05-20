<script>
  import { filesize } from "filesize";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import Badge from "$lib/components/delivery/Badge.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";

  export let delivery;

  
  let uploads;
  const Render = State.make();

  Render.cleanup = () => {
    uploads = [];
  };

  Render.uploads = () => {
    uploads = delivery.files;
  };


  Render.reset();
  onMount(() => {
    Render.uploads();
    return () => {
      Render.reset();
    };
  });

  $: Render.uploads( delivery );
</script>


{#if uploads.length > 0 }
  <h2>Uploads</h2>

  <div class="gobo-table">
    {#each uploads as upload (upload.name)}
      <div class="table-row">
        <div class="metadata">
          <p>
            { upload.name }
          </p>
          {#if upload.size}
            <p>
              Size: {filesize( upload.size )}
            </p>
          {/if}
        </div>

        {#if upload.state === "pending"}
          <Badge label="Pending" family="neutral"/>
        {:else if upload.state === "uploaded"}
          <Badge label="Uploaded" family="success"/>
        {:else if upload.state === "error"}
          <Badge label="Failure" family="danger"/>
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