<script>
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/spinner/spinner.js";
  import Post from "$lib/components/Post.svelte"
  import { onDestroy, onMount } from "svelte";
  import { browser } from "$app/environment";
  import { sleep } from "@dashkite/joy/time";
  import { scrollStore } from "$lib/stores/scroll.js";
  import posts from "$lib/stores/posts.js";
  
  export let data;
  let form, button;
  let results = [];
  let loading = false;
  let searchTerm = data.bindings.search || null;
  let unsubscribeScroll, resultsSection;

  const isValidString = function ( string ) {
    return ( string != null ) && ( string.length > 0 );
  };

  const issueRequest = async function () {
    let formData = new FormData( form );
    let search = formData.get( "search" );
    console.log( `searching for ${search}` );
    await sleep( 500 );
    
    if ( isValidString( search ) ) {
      results = [ posts[0] ];
    }
    
    loading = false;
    button.loading = false;
  }

  const submit = async function () {
    if ( loading !== true ) {
      loading = true;
      button.loading = true;
      await issueRequest();
    }
  }

  if ( browser ) {
    onMount( async function () {
      form.addEventListener( "submit", async function( event ) {
        await submit();
      });

      if ( isValidString( searchTerm ) ) {
        await submit();
      }

      unsubscribeScroll = scrollStore.subscribe( function ({ deltaY }) {
        if ( resultsSection != null ) {
          resultsSection.scrollBy( 0, deltaY );
        }
      })
    });

    onDestroy( function() {
      unsubscribeScroll();
    });
  }

</script>

<form class="gobo-form" bind:this={form}>
  <h1>Search</h1>
  <sl-input
    name="search"
    value="{searchTerm}"
    inputmode="text"
    placeholder="Search"
    size="medium"
    autocomplete="off"
    >></sl-input>

  <sl-button
    bind:this={button}
    type="submit"
    variant="primary"
    size="medium">
    Search
  </sl-button>
  <sl-divider class="gobo-divider"></sl-divider>
</form>

{#if loading === true}
  <div class="spinner-box">
    <sl-spinner></sl-spinner>
  </div>
{:else}
  {#if results.length !== 0 }
    <section bind:this={resultsSection}>
      <h2>Results</h2>
      {#each results as result (result.id)}
        <Post {...result}></Post>
      {/each}
    </section>
  {/if}
{/if}


<style>
  .spinner-box {
    max-width:  36rem;
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  .spinner-box > sl-spinner {
    font-size: 3rem;
  }
</style>


