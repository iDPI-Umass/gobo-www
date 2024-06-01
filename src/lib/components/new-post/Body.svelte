<script>
  import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
  import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
  import TextArea from "$lib/components/new-post/textarea/TextArea.svelte";
  import Counts from "$lib/components/new-post/Counts.svelte"
  import { onMount } from "svelte";
  import { State } from "$lib/engines/draft.js";

  let textarea;
  let content, placeholder;
  const Render = State.make();
  
  Render.cleanup = () => {
    content = "";
  };

  Render.content = ( draft ) => {
    content = draft.content;
  };

  // This depends on two different aspects, but we pass the whole draft through
  // currently, so we can use the same render helper.
  Render.placeholder = ( draft ) => {
    if ( draft.reply != null ) {
      placeholder = "Write your reply"
    } else if ( draft.quote != null ) {
      placeholder = "Write your quote post"
    } else {
      placeholder = "Write your post";
    }
  };


  const Handle = {};

  Handle.addThreadpoint = ( event ) => {
    const platform = event?.detail?.platform;
    if ( platform == null ) {
      console.error( "got add threadpoint event without platform" );
    } else {
      textarea.addThreadpoint( platform );
    }
  };


  Render.reset();
  onMount(() => {
    Render.listen( "content", Render.content );
    Render.listen( "reply", Render.placeholder );
    Render.listen( "quote", Render.placeholder );
    return () => {
      Render.reset();
    };
  });
</script>


<TextArea
  bind:this={textarea}
  {placeholder}
  {content}
/>

<Counts 
  on:add-threadpoint={Handle.addThreadpoint}
/>


<style>
</style>