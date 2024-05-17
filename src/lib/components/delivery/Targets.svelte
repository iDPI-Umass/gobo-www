<script>
  import * as Time from "@dashkite/joy/time";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Name } from "$lib/engines/draft.js";

  export let delivery;


  let targets;
  const Render = State.make();

  Render.cleanup = () => {
    targets = [];
  };

  Render.targets = () => {
    targets = delivery.targets;
  };


  Render.reset();
  onMount(() => {
    Render.targets();
    return () => {
      Render.reset();
    };
  });

  $: Render.targets( delivery );
</script>


{#if targets.length > 0 }
  <h2>Identities</h2>

  <div class="gobo-table">
    {#each targets as target (target.id)}
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
          <Spinner size="1.5rem"></Spinner>
        {:else if target.state === "delivered"}
          <sl-icon src="/icons/check2-circle.svg" class="success" />
        {:else if target.state === "error"}
          <sl-icon src="/icons/exclamation-octagon.svg" class="danger" />
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
</style>