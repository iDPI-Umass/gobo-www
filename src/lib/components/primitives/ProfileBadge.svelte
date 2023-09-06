<script>
  import { profileStore } from "$lib/stores/profile";
  import { onMount, onDestroy } from "svelte";
  
  let unsubscribeProfileStore;
  let name; 

  onMount( function () {
    unsubscribeProfileStore = profileStore.subscribe( function ( profile ) {
      if ( profile.name != null ) {
        name = profile.name;
      }
    });
  });

  onDestroy( function () {
    unsubscribeProfileStore();
  });
</script>

<nav>
  <sl-button
    href="/settings"
    pill>
    {name}
  </sl-button>
</nav>

<style>
  nav {
    margin-right: 3.5rem;
  }
  
  nav sl-button::part(base) {
    height: 2.1875rem;
    background-color: var(--gobo-color-panel);
    border: var(--gobo-border-panel);
    color: var(--gobo-color-button-lens);
  }

  nav sl-button::part(label) {
    font-size: var(--gobo-font-size-detail);
    font-weight: var(--gobo-font-weight-medium);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

</style>
