<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  export let href;
  export let action = function () {};
</script>


<a class="nav-link" href={href} on:click={ action }>
  <slot></slot>
  <sl-icon src="/icons/chevron-right.svg"></sl-icon>
</a>


<style>
  .nav-link {
    color: var(--gobo-color-text);
    font-size: var(--gobo-font-size-copy);
    text-decoration: none;
    margin: 0;
    padding: 1rem;
    border-bottom: 1px solid var(--gobo-color-text-muted);
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }

  sl-icon {
    font-size: 20px;
    color: var(--gobo-color-text-muted);
  }
</style>
