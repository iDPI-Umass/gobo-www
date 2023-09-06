<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import Center from "$lib/components/layouts/Center.svelte"
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "$lib/styles/buttons.css";
</script>

<PlainHeader></PlainHeader>
<Center>
  <div class="main-child">
    <section class="gobo-copy">
      <header>
        <h1>Welcome to Gobo!</h1>
        <h2>A loyal social media client</h2>
      </header>
      <p>Gobo enables you to aggregate your social media feeds, 
        control the algorithms applied to your feeds, and 
        cross-post to different platforms.
      </p>
      <nav>
        <sl-button
          href="/identities"
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