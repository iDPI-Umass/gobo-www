<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
</script>

<section>
  <h1>Your Identities</h1>
  <h2>Mastodon</h2>
  <p>No identities currently registered.</p>
  <sl-divider></sl-divider>
  <h2>Reddit</h2>
  <p>No identities currently registered.</p>
  <sl-divider></sl-divider>
  <h2>Twitter</h2>
  <p>No identities currently registered.</p>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    margin: 2rem 0 0 0;
    padding: 0;
    max-width: 40rem;
  }

  section > h1 {
    font-size: var(--sl-font-size-x-large);
    margin: 0 0 2rem 0;
  }

  section > h2 {
    font-size: var(--sl-font-size-large);
    margin-bottom: 1rem;
  }

  section > sl-divider {
    --width: 1px;
    --color: var(--sl-color-neutral-400);
    margin: 1rem 2rem 1rem 0;
  }

  @media ( min-width: 680px ) {
    section {
      margin: 0;
      padding-left: 3rem;
    }

    section > h1 {
      margin: 0 0 2rem 0;
    }
  }
</style>


