<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Identity, Name } from "$lib/engines/identity.js";
  import { Post } from "$lib/engines/post.js";
  import { Filter } from "$lib/engines/filter.js";

  export let bindings;

  let state, identity, post, keywords, usernames, domains;
  const Render = State.make();
  Render.cleanup = () => {
    state = "loading";
    identity = null;
    post = null;
    keywords = [];
    usernames = [];
    domains = [];
  };

  Render.reason = async () => {
    const results = await Promise.all([
      Identity.find( bindings.identity ),
      Post.get( bindings ),
      Filter.findCategory( "block-keyword" ),
      Filter.findCategory( "block-username" ),
      Filter.findCategory( "block-domain" )
    ]);

    identity = results[0];
    if ( identity == null ) {
      state = "error";
      console.error("render reason: identity is undefined");
      return;
    }
    post = results[1];
    if ( post == null ) {
      state = "error";
      console.error("render reason: post is undefined");
      return;
    }
    keywords = results[2].slice(0, 3);
    usernames = results[3].slice(0, 3);
    domains = results[4].slice(0, 3);
    state = "ready";
  };


  Render.reset();
  onMount(() => {
    Render.reason();
    return () => {
      Render.reset();
    };
  })
</script>


<section class="gobo-copy"> 
  {#if state === "error"}
    <p>There was a problem displaying this reason.</p>
  {:else if state === "loading"}
    <Spinner></Spinner>
  {:else if state === "ready"}
    <p>
      Gobo allows you to configure your feed and control which posts you see.
      You see this post for the following reasons:
    </p>

    <h2>Selected Identity</h2>
    <p>
      Your feed is configured to include posts from
      <a 
        href={identity.profile_url}
        class="profile"
        target="_blank" 
        rel="noopener noreferrer nofollow">
        
        {#each Name.split(identity.prettyName) as part}
          <span>{part}</span>
        {/each}      
      </a>

      on <span class="platform">{identity.platform}</span>.
    </p>


    {#if keywords.length > 0}
      <h2>Passed Keyword Filters</h2>
      <p>
        This post passed your keyword filters, like 
        "{keywords.join("\" and \"")}".
      </p>
    {/if} 
    
    {#if usernames.length > 0}
      <h2>Passed Username Filters</h2>
      <p>
        This post passed your username filters, like 
        "{usernames.join("\" and \"")}".
      </p>
    {/if} 

    {#if domains.length > 0}
      <h2>Passed Domain Filters</h2>
      <p>
        This post passed your domain filters, like 
        "{domains.join("\" and \"")}".
      </p>
    {/if} 
    
    <h2>Feed Sorting</h2>
    <p>
      This post's location is controlled by your feed sort, 
      currently reverse-chronological order.
    </p>
  
  {/if}

  <nav class="two-button">
    
    <sl-button
      class="action"
      size="medium"
      href="/settings/filters"
      pill>
      Edit Filters
    </sl-button>
    
    <sl-button
      class="submit"
      size="medium"
      href="/home"
      pill>
      Return to Feed
    </sl-button>
  
  </nav>
    
</section>


<style>
  .profile span {
    margin: 0;
    word-break: break-word;
  }

  .platform {
    text-transform: capitalize;
  }

  .gobo-copy h2 {
    font-size: 1.25rem;
    font-weight: var(--gobo-font-weight-black);
    margin-bottom: 0;
    margin-top: var(--gobo-height-spacer-flex);
  }

  .gobo-copy p {
    margin-top: 0.5rem;
  }
</style>