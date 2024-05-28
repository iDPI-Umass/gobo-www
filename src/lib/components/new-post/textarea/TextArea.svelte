<script>
  import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
  import { Essentials } from "@ckeditor/ckeditor5-essentials";
  import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
  import { GoboDivider } from "$lib/components/new-post/textarea/gobo-divider.js";
  import { ResizableHeight } from "$lib/components/new-post/textarea/resizable-height.js";
  import { onMount, tick } from "svelte";
  import { State, Draft } from "$lib/engines/draft.js";

  let anchor, editor;
  const Render = State.make();
  
  Render.cleanup = () => {
    if ( editor != null ) {
      editor.model.document.on( "change:data", Handle.content );
      editor.destroy();
    }
  };

  Render.area = async () => {
    await tick();
    anchor = document.querySelector( "#text-edit-anchor" );
    editor = await ClassicEditor.create( anchor, {
      plugins: [
        Essentials,
        Paragraph,
        ResizableHeight,
        GoboDivider
      ],
      
      ui: {
        poweredBy: {
          side: "left"
        }
      },

      ResizableHeight: {
        height: "10rem",
      }
    });

    editor.model.document.on( "change:data", Handle.content );
  };


  const Handle = {};
  Handle.content = () => {
    const content = editor.getData();
    Draft.updateAspect( "content", content );
  };


  Render.reset();
  onMount(() => {
    Render.area();
    return () => {
      Render.reset();
    };
  });

/*
  <sl-icon
    src="/icons/bluesky.svg" 
    class="bluesky" />
*/
</script>



<div id="text-edit-anchor">
  <p>First post: Hello, World!</p>
  <p>Second post: Here is more content!</p>
</div>


<style>
  /* TODO: 
    We should style this more gracefully via the CSS variables CKEditor5 exposes.
    I had trouble getting that to cooperate on first try, so this is brute-force
    for now. There is a style interface listing on this reference page:
    
    https://ckeditor.com/docs/ckeditor5/latest/installation/advanced/content-styles.html

    But it appeared incomplete when I sought a foundational variable:
    --ck-color-base-background

    It wasn't in the listing. And I'm not sure how to get the cascade to work
    between what Svelte and CKEditor are doing.
  */
  :global(.ck.ck-reset.ck-editor) {
    background: none;
    border: none;
  }


  :global(.ck.ck-content.ck-editor__editable),
  :global(.ck.ck-content.ck-editor__editable:not(.ck-focused)) {
    background: var(--gobo-color-null);
    border-radius: 0.25rem;
    border: var(--gobo-border-panel);
    padding: 1rem;
    overflow-y: scroll;
  }

  :global(.ck.ck-content.ck-editor__editable.ck-focused) {
    border: var(--gobo-border-panel);
    box-shadow: none !important;
  }

  /* Hide toolbar. It's one pixel tall when empty, and we don't desire that affordance. */
  :global(.ck.ck-editor__top) {
    display: none;
  }

  :global(.ck.ck-content.ck-editor__editable sl-icon) {
    cursor: pointer;
  }


</style>