<script>
  import { profileStore } from "$lib/stores/profile";
  import { onMount, onDestroy } from "svelte";
  
  let unsubscribeProfileStore;
  let name; 

  onMount( function () {
    unsubscribeProfileStore = profileStore.subscribe( function ( profile ) {
      name = profile.display_name;
    });
  });

  onDestroy( function () {
    unsubscribeProfileStore();
  });
</script>

<a href="/settings" class="profile-badge">
  {name}
</a>

<style>
  .profile-badge {
    min-width: max-content;
    padding: 0.5rem 1rem 0.5rem 1rem;
    border-radius: var(--sl-border-radius-pill);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-bold);
    font-family: var(--sl-font-sans);
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
    text-decoration: none;
    margin: 1rem;
    flex: 1 0 0%;
  }

  .profile-badge:focus {
    margin: calc(1rem - 2px);
    border: 2px solid var(--sl-color-neutral-1000);
  }
</style>
