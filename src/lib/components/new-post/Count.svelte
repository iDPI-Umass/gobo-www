
<script>
  import "@shoelace-style/shoelace/dist/components/progress-ring/progress-ring.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import { onMount } from "svelte";
  import { Post } from "$lib/engines/post.js";
  import { State } from "$lib/engines/draft.js";
  import { Platforms } from "$lib/engines/platforms/index.js";

  export let content;
  export let platform;
  
  let logo = Post.logo({ platform });
  let Model = Platforms.get( platform );

  let maximum, progress, remaining, tooMany;
  const Render = State.make();
  Render.cleanup = () => {
    maximum = Model?.limits.characters ?? 1;
    remaining = maximum;
    tooMany = false;
  };

  Render.count = () => {
    const count = Model.contentLength( content );
    const ratio = Math.floor(100 * count / maximum );
    tooMany = ratio > 100;
    progress = Math.min( 100, ratio );
    remaining = new Intl.NumberFormat()
      .format( maximum - count );
  };

  Render.reset();
  onMount(() => {
    return () => {
      Render.reset();
    };
  });

  $: Render.count( content );
</script>


<div>
  <sl-icon src="{ logo }" class="{ platform }"></sl-icon>

  <span>{ remaining }</span>

  <sl-progress-ring
    style="
      --size: 24px;
      --track-color: var(--gobo-color-border-panel);
      --indicator-color: {tooMany ? "var(--gobo-color-danger)" : "var(--gobo-color-primary)"};
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
