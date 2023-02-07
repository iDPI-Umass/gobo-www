<script>
  import posts from "./posts.js";
  import { guard } from "$lib/helpers/guard";
  export let data;

  const id = Number( data.bindings.id );
  const url = posts.find( post => post.id === id ).url;
  guard();
</script>

<div class="frame">
  <img src="{url}">
</div>

<style>
  .frame {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  img {
    height: 95%;
    width: 95%;
    object-fit: contain;
  }
</style>