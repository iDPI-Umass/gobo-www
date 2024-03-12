<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import Center from "$lib/components/layouts/Center.svelte"
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import { goto } from "$app/navigation";

  export let data;
  let unused = [ data ];

  const Handle = {};
  Handle.complete = () => {
    goto("/identities");
  }
</script>

<PlainHeader></PlainHeader>
<Center>
  <div class="main-child">
    <section class="gobo-copy">
      <header>
        <h1>We are adding your identity!</h1>
      </header>
      <p> 
        This might take a couple minutes. 
        Refresh your feed to see if it's ready.
      </p>
      <nav>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <sl-button
          on:click={Handle.complete}
          class="submit"
          size="medium"
          pill>
          Continue
        </sl-button>
      </nav>
    </section>
  </div>
  
</Center>


<style>
  .gobo-copy {
    margin-top: var(--gobo-height-spacer);
  }

  .main-child {
    gap: 1rem;
  }

  .gobo-copy nav {
    justify-content: flex-start;
  }

  .gobo-copy header {
    margin-bottom: 0;
  }

</style>