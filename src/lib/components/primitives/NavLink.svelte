<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";

  export let href
  export let action = function () {};
</script>

<a href={href} on:click={ action }>
  <slot></slot>
</a>
<sl-divider></sl-divider>

<style>
  a {
    font-size: var(--sl-font-size-large);
    text-decoration: none;
    color: inherit;
    margin: 0;
    padding: 1rem;
  }

  a:focus {
    margin: 0;
    padding: calc( 1rem - 2px );
  }

  sl-divider {
    --width: 1px;
    --color: var(--sl-color-neutral-400);
    margin: 0;
  }
</style>
