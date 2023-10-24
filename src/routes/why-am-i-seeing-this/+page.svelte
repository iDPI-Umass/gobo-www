<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte"
  import FooterNav from "$lib/components/headers/FooterNav.svelte";
  import Center from "$lib/components/layouts/Center.svelte"
  import "$lib/styles/buttons.css";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
</script>

<MainHeader></MainHeader>
<Center>
  <div class="main-child">
    <header>
      <h1>Why Am I Seeing This?</h1>
    </header>

    <section class="gobo-copy">  
      <p>This page is pending.</p>
  
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
  
      <nav class="two-button">
        
        <sl-button
          class="action"
          size="medium"
          href="/settings/filters"
          pill>
          Edit Filters
        </sl-button>
        
        <sl-button
          class="submit"
          size="medium"
          href="/home"
          pill>
          Return to Feed
        </sl-button>
      
      </nav>
      
    </section>
  </div>
  
</Center>
<FooterNav></FooterNav>


<style>
</style>