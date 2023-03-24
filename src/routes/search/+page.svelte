<script>
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/spinner/spinner.js";
  import Post from "$lib/components/Post.svelte"
  import "$lib/styles/buttons.css";
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
        // We don't prevent default, automatically adjusting the location to
        // include the search query.
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

<div class="main-child">
  <header>
    <h1>Search</h1>
  </header>

  <form class="gobo-form" bind:this={form}>
    
    <sl-input
      name="search"
      value="{searchTerm}"
      inputmode="text"
      placeholder="Search"
      size="medium"
      autocomplete="off">
    </sl-input>
  
    <div class="buttons">
      <sl-button
        bind:this={button}
        class="submit"
        type="submit"
        variant="primary"
        size="medium"
        pill>
        Search
      </sl-button>
    </div>
    
  </form>
  
  {#if loading === true}
    <div class="spinner-box">
      <sl-spinner></sl-spinner>
    </div>
  {:else}
    {#if results.length !== 0 }
      <section class="results" bind:this={resultsSection}>
        <header>
          <h2>Results</h2>
        </header>
        
        {#each results as result (result.id)}
          <Post {...result}></Post>
        {/each}
      
      </section>
    {/if}
  {/if}
</div>




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

  form sl-input {
    margin-bottom: 0;
  }

  .buttons {
    border: none;
    margin: 0;
  }

  .results header {
    margin-top: 0.5rem;
    margin-bottom: var(--gobo-height-spacer-flex);
    border-bottom: var(--gobo-border-hr);
  }
</style>


