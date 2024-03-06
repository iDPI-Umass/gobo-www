
<script>
  import "@shoelace-style/shoelace/dist/components/progress-ring/progress-ring.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import * as h from "$lib/engines/post.js";
  import { onMount } from "svelte";
  import { State, Bluesky, Mastodon, Smalltown, Reddit } from "$lib/engines/draft.js";

  export let platform;
  
  let logo = h.getLogo( platform );
  let Model = Bluesky;
  switch ( platform ) {
    case "bluesky":
      Model = Bluesky;
      break;
    case "mastodon":
      Model = Mastodon;
      break;
    case "smalltown":
      Model = Smalltown;
      break;
    case "reddit":
      Model = Reddit;
      break;
    default:
      console.error( `Count: unknown platform ${ platform }`);
  }


  let count, maximum, progress, remaining;
  const Render = State.make();
  Render.cleanup = () => {
    count = 0;
    maximum = Model?.limit ?? 1;
    progress = 0;
    remaining = 0;
  };

  Render.count = () => {
    count = Model.contentLength();
    progress = Math.min( 100, Math.floor(100 * count / maximum ));
    remaining = new Intl.NumberFormat()
      .format( maximum - count );
  };

  Render.reset();
  onMount(() => {
    Render.listen( "content", Render.count );
    return () => {
      Render.reset();
    };
  });
</script>


<div>
  <sl-icon src="{ logo }" class="{ platform }"></sl-icon>

  <span>{ remaining }</span>

  <sl-progress-ring
    style="
      --size: 32px;
      --track-color: var(--gobo-color-border-panel);
      --indicator-color: var(--gobo-color-primary);
    "
    value="{ progress }">
  </sl-progress-ring>
</div>


<style>
  div {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  div span {
    display: flex;
    justify-content: center;
    min-width: 1.5rem;
  }
</style>
