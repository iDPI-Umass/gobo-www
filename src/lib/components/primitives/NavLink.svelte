<script>
  import Divider from "$lib/components/primitives/Divider.svelte"
  export let href
  export let action = function () {};
</script>

<a href={href} on:click={ action }>
  <slot></slot>
</a>
<Divider></Divider>

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
</style>
