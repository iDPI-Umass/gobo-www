<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte"
  import LeftRight from "$lib/components/layouts/LeftRight.svelte"
  import Fascinator from "$lib/components/primitives/Fascinator.svelte"
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
</script>

<MainHeader></MainHeader>
<LeftRight>
  <section slot="left" class="gobo-copy">
    <h1>Why Am I Seeing This?</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
      commodo consequat.
    </p>
    <p>
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>

    <sl-divider class="gobo-divider"></sl-divider>

    <div class="button-panel">
      <sl-button
        variant="primary"
        size="medium"
        href="/home/settings">
        Edit Filters
      </sl-button>
      <sl-button
        variant="primary"
        size="medium"
        href="/home">
        Return to Feed
      </sl-button>
    </div>
    
  </section>
  
  <Fascinator slot="right"></Fascinator>
</LeftRight>


<style>
  sl-divider {
    margin-top: 2rem;
  }

  .button-panel {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    margin-top: 1rem;
  }
</style>