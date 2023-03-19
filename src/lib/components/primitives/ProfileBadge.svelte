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

<span class="profile-badge">
  {name}
</span>

<style>
  .profile-badge {
    min-width: max-content;
    font-size: 0.9375rem;
    font-weight: var(--gobo-font-weight-bold);
    color: var(--gobo-color-text);
    text-decoration: none;
    margin-right: 3.5rem;
    flex: 1 0 0%;
  }
</style>
