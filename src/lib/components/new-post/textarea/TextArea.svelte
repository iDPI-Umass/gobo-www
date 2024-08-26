<script>
  import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
  import { Essentials } from "@ckeditor/ckeditor5-essentials";
  import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
  import { ResizableHeight } from "$lib/components/new-post/textarea/resizable-height.js";
  import { Threadpoint } from "$lib/components/new-post/textarea/threadpoint.js";
  import { Mention } from "$lib/components/new-post/textarea/mention.js";
  import { onMount } from "svelte";
  import { State as EventState } from "$lib/engines/store.js";
  import { State, Draft } from "$lib/engines/draft.js";
  import { Thread } from "$lib/engines/thread.js";
  import { bodyEvents, mentionEvents } from "$lib/stores/draft.js";

  export let placeholder = "Write your post! Use @ for mentions.";
  export let content = "";

  export function addThreadpoint( platform ) {
    if ( editor != null ) {
      editor.execute( "add-threadpoint", { value: platform });
    }
  }

  export function focus() {
    editor.editing.view.focus();
  }

  let anchor, editor, platforms;
  let newMention;
  const Render = State.make();
  const Event = EventState.make();
  
  Render.cleanup = () => {
    platforms = [];
    if ( editor != null ) {
      editor.model.document.on( "change:data", Handle.content );
      editor.destroy();
    }
    newMention = null;
  };

  Render.area = async () => {
    anchor = document.querySelector( "#text-edit-anchor" );
    editor = await ClassicEditor.create( anchor, {
      plugins: [
        Essentials,
        Paragraph,
        ResizableHeight,
        Threadpoint,
        Mention,
      ],
      placeholder: placeholder,
      ui: {
        poweredBy: {
          side: "left"
        }
      },
      ResizableHeight: {
        height: "10rem",
      }
    });

    editor.editing.view.document.on( "keydown", Handle.mentionCreation );
    editor.model.document.on( "change:data", Handle.content );
    editor.setData( content ?? "" );
  };

  Render.content = () => {
    if ( editor != null ) {
      editor.setData( content );
    }
  }


  const Handle = {};

  Handle.mentionCreation = ( event, data ) => {
    if ( data.domEvent.key === "@" ) {
      data.preventDefault();
      event.stop();
      newMention = { id: window.crypto.randomUUID() };
      editor.execute( "add-mention", newMention );
    }
  };

  Handle.bodyEvents = ( event ) => {
    switch (event.type) {
      case "focus-mention": {
        editor.execute( "focus-mention", event.detail );
        bodyEvents.put(null);
        break;
      }

      case "blur-mention": {
        editor.execute( "blur-mention", event.detail );
        bodyEvents.put(null);
        break;
      }

      default: {
        console.warning( "got unknown body event", event )
      }
    }
  };

  Handle.content = async () => {
    const content = editor.getData();
    let draft = Draft.updateAspect( "content", content );
    const thread = Thread.parse( draft );
    draft = Draft.updateAspect( "thread", thread );
    
    if ( newMention != null ) {
      const detail = newMention;
      newMention = null;
      const mentionEvent = new CustomEvent( "focus-mention", { detail });
      mentionEvents.put( mentionEvent );
    }
  };


  Render.reset();
  onMount(() => {
    Render.area();
    Event.listen( bodyEvents, Handle.bodyEvents );
    return () => {
      Event.reset();
      Render.reset();
    };
  });
</script>



<div id="text-edit-anchor">
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
    border-radius: 0.375rem;
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

  :global(.ck.ck-content.ck-editor__editable .threadpoint) {
    cursor: pointer;
    padding: 0 0.25rem;
    display: inline-flex;
    align-items: center;
    height: 21px;
  }

  :global(.ck.ck-content.ck-editor__editable .mention) {
    cursor: pointer;
    padding: 0 0.25rem;
    display: inline-flex;
    align-items: center;
    height: 21px;
  }

  :global(.ck.ck-content.ck-editor__editable .mention[data-focus="true"]) {
    background-color: var(--gobo-color-primary);
    border-radius: 0.2rem;
  }
</style>