<script>
  import * as Time from "@dashkite/joy/time";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Name } from "$lib/engines/draft.js";

  export let frame;


  let state, targets;
  const Render = State.make();

  Render.cleanup = () => {
    state = "halt";
    targets = [];
  };

  Render.targets = ( value ) => {
    targets = value;
  };


  const Target = {};

  Target.isTerminal = ( target ) => {
    return [ "delivered", "error" ].includes( target.state );
  };

  const Cycle = {};

  Cycle.isDone = () => {
    return targets.every( Target.isTerminal );
  };

  Cycle.run = async () => {
    while ( true ) {
      console.log("fetching state")
      if ( state == null || state === "halt" ) {
        return;
      }
      if ( Cycle.isDone() ) {
        return;
      }
      if ( state === "fetch" ) {
        await frame.sync();
        await Time.sleep( 2000 );
      }
    }
  };

  Cycle.start = () => {
    state = "fetch";
    Cycle.run();
  };


  const Handle = {};


  Render.reset();
  onMount(() => {
    Render.listen( frame.stores.targets, Render.targets );
    Cycle.start();
    return () => {
      Render.reset();
    };
  });
</script>


{#if targets.length > 0 }
  <h2>Identities</h2>

  <div class="gobo-table">
    {#each targets as target (target.id)}
      <div class="table-row">
        <div class="platform">
          <sl-icon 
            src="/icons/{target.platform}.svg" 
            class={target.platform} />
          
          <p>
            {#each Name.split(target.prettyName) as part}
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