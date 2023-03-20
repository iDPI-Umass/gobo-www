<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  export let href;
  export let action = function () {};
</script>

<sl-divider></sl-divider>

<a class="nav-link" href={href} on:click={ action }>
  <slot></slot>
  <sl-icon src="icons/chevron-right.svg"></sl-icon>
</a>


<style>
  .nav-link {
    font-size: var(--sl-font-size-copy);
    text-decoration: none;
    color: var(--gobo-color-text);
    margin: 0;
    padding: 1rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }

  .nav-link:focus {
    margin: 0;
    padding: calc( 1rem - 2px );
  }

  sl-icon {
    font-size: 20px;
    color: var(--gobo-color-text);
  }

  sl-divider {
    --color: var(--gobo-color-text);
  }
</style>
