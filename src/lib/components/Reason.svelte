<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import * as Post from "$lib/resources/post.js";
  import * as FeedSaver from "$lib/engines/feed-singleton.js";
  import { State } from "$lib/engines/store.js";
  import { Name } from "$lib/engines/draft.js";

  export let bindings;

  let identity, post, filters;
  const Render = State.make();
  Render.cleanup = () => {
    identity = null;
    post = null;
    filters = [];
  };

  Render.reason = async () => {
    const results = await Promise.all([
      Render.identity(),
      Render.post(),
      Render.filters(),
    ]);
    
    for ( const result of results ) {
      if ( result == null ) {
        throw new Error("unable to fetch either identity or post from IDs.");
      }
    }
   
    identity = results[0];
    post = results[1];
    filters = results[2];
  };

  Render.getIdentity = async ( id ) => {
    const engine = await FeedSaver.getEngine();
    const identities = engine.getIdentities();
    return identities.find(( identity ) => identity.id == id );
  };

  Render.identity = async () => {
    let identity;
    try {
      identity = await Render.getIdentity( bindings.identity );
    } catch ( error ) {
      console.error( error );
    }
    return identity;
  };

  Render.post = async () => {
    let post;
    try {
      post = await Post.get( bindings );
    } catch ( error ) {
      console.error( error );
    }
    return post;
  };

  Render.getFilterCategory = async ( category ) => {
    const engine = await FeedSaver.getEngine();
    const filters = engine.getFilters();
    return filters
      .filter( f => (f.category === category) && (f.active === true) )
      .map( f => f.configuration.value );
  };

  Render.filters = async () => {
    let filters;
    try {
      filters = await Render.getFilterCategory( "block-keyword" );
    } catch ( error ) {
      console.error( error );
    }
    return filters;
  }

  Render.reset();
</script>


<section class="gobo-copy"> 
  {#await Render.reason()}
    <Spinner></Spinner>
  {:then}
    <p>
      Gobo allows you to configure your feed and control which posts you see.
      You see this post for the following reasons:
    </p>

    <h2>Selected Identity</h2>
    <p>
      Your feed is includes posts from
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


    {#if filters.length > 0}
      <h2>Passed Filters</h2>
      <p>
        This post passed your keyword filters, like 
        "{filters.join("\" and \"")}".
      </p>
    {/if}  
    
    <h2>Feed Sorting</h2>
    <p>
      This post's location is controlled by your feed sort, 
      currently reverse-chronological order.
    </p>


  {:catch}
    <!-- TODO: Do we need something here for 404 reponses to post graphs or identities? -->
    <p>There was a problem rendering this visibility reason.</p>
  {/await}



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