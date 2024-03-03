<script>
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
  import { onMount } from "svelte";
  import { State, Draft } from "$lib/engines/draft.js";

  let content, placeholder;
  const Render = State.make();

  Render.cycle = ( draft ) => {
    content = draft.content;
    if ( draft.reply != null ) {
      placeholder = "Write your reply"
    } else if ( draft.quote != null ) {
      placeholder = "Write your quote post"
    } else {
      placeholder = "Write your post";
    }
  };

  Render.cleanup = () => {
    content = null;
    placeholder = "Write your post";
  };


  const Handle = {};
  Handle.content = ( event ) => {
    Draft.updateAspect( "content", event.target.value );
  };


  Render.reset();
  onMount(() => {
    Render.listen( "content", Render.cycle );
    return () => {
      Render.reset();
    };
  });
</script>


<sl-textarea
  on:sl-input={ Handle.content }
  value={ content }
  { placeholder }
  size="medium"
  resize="none"
  rows=4>
</sl-textarea>

<style>
  sl-textarea {
    margin-top: var(--gobo-height-spacer-flex);
  }

  sl-textarea::part(base) {
    font-size: 1.125rem;
    border-radius: var(--gobo-border-radius)
  }

  sl-textarea::part(textarea) {
    padding: 0.5rem 1rem;
  }
</style>