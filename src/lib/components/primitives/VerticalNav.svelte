<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
</script>

<nav>
  <slot></slot>
  <sl-divider class="gobo-divider"></sl-divider>
</nav>


<style>
  nav {
    flex: 1 1 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    margin: 0;
    max-width: 36rem;
  }

  sl-divider {
    --color: var(--gobo-color-text);
  }
</style>