import { Command, Plugin } from "@ckeditor/ckeditor5-core";
import DomEventObserver from "@ckeditor/ckeditor5-engine/src/view/observer/domeventobserver";
import { 
  Widget,
  toWidget,
  viewToModelPositionOutsideModelElement
} from "@ckeditor/ckeditor5-widget";


const Helpers = {};


class DoubleClickObserver extends DomEventObserver {
	constructor( view ) {
		super( view );
		this.domEventType = "dblclick";
	}

	onDomEvent( domEvent ) {
		this.fire( domEvent.type, domEvent );
	}
}


class AddMentionCommand extends Command {
  execute( detail ) {
    const editor = this.editor;
    const selection = editor.model.document.selection;

    editor.model.change( writer => {
      const position = editor.model.document.selection.getFirstPosition();  
      
      // Create a mention model element...
      const mention = writer.createElement( "mention", {
        ...Object.fromEntries( selection.getAttributes() ),
        focus: false,
        id: detail.id
      });

      // ...and insert it into the document model.
      editor.model.insertObject( mention, null, "before", {
        findOptimalPosition: "before",
        setSelection: "after"
      });
    });
  }

  refresh() {
    this.isEnabled = true;
  }
}

class RemoveMentionCommand extends Command {
  execute({ target }) {
    this.editor.model.change( writer => {
      writer.remove( target );
    });
  }

  refresh() {
    this.isEnabled = true;
  }
}

class FocusMentionCommand extends Command {
  execute({ id }) {
    const dom = document.querySelector( `span.mention[data-id="${id}"]`);
    if (!dom) {
      return;
    }
    const view = this.editor.editing.view.domConverter.domToView( dom );
    if (!view) {
      return;
    }
    const target = this.editor.editing.mapper.toModelElement( view );
    if (!target) {
      return
    }
    this.editor.model.change( writer => {
      writer.setAttribute( "focus", true, target );
    });
  }

  refresh() {
    this.isEnabled = true;
  }
}

class BlurMentionCommand extends Command {
  execute({ id }) {
    const dom = document.querySelector( `span.mention[data-id="${id}"]`);
    if (!dom) {
      return;
    }
    const view = this.editor.editing.view.domConverter.domToView( dom );
    if (!view) {
      return;
    }
    const target = this.editor.editing.mapper.toModelElement( view );
    if (!target) {
      return
    }
    this.editor.model.change( writer => {
      writer.setAttribute( "focus", false, target );
    });
  }

  refresh() {
    this.isEnabled = true;
  }
}


Helpers.matchMention = ( editor, target ) => {
  if ( target?.hasClass("mention") ) {
    return editor.editing.mapper.toModelElement( target );
  }
  if ( target?.parent?.hasClass("mention") ) {
    return editor.editing.mapper.toModelElement( target.parent );
  }
  return;
};

export default class MentionEditing extends Plugin {
  static get requires() {
    return [ Widget ];
  }

  init() {
    this._defineSchema(); 
    this._defineConverters();
    
    this.editor.commands.add( 
      "add-mention",
      new AddMentionCommand( this.editor )
    );
    this.editor.commands.add( 
      "remove-mention",
      new RemoveMentionCommand( this.editor )
    );
    this.editor.commands.add( 
      "focus-mention",
      new FocusMentionCommand( this.editor )
    );
    this.editor.commands.add( 
      "blur-mention",
      new BlurMentionCommand( this.editor )
    );

    this.editor.editing.mapper.on(
      "viewToModelPosition",
      viewToModelPositionOutsideModelElement( 
        this.editor.model, 
        viewElement => viewElement.hasClass( "mention" ) 
      )
    );

    const editor = this.editor;
    const view = this.editor.editing.view;
    view.addObserver( DoubleClickObserver );    
    this.editor.listenTo( view.document, "dblclick", ( evt, data ) => {
      const match = Helpers.matchMention( editor, data.target );
      if ( match != null ) {
        editor.execute( "remove-mention", { target: match });
      }
    });
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register( "mention", {
      // Behaves like a self-contained inline object (e.g. an inline image)
      // allowed in places where $text is allowed (e.g. in paragraphs).
      // The inline widget can have the same attributes as text 
      // (for example linkHref, bold).
      inheritAllFrom: "$inlineObject",

      // The widget can have many types, like date, name, surname, etc:
      allowAttributes: [ "id", "focus" ]
    } );
  }

  _defineConverters() {
    const conversion = this.editor.conversion;

    conversion.for( "upcast" ).elementToElement( {
      view: {
        name: "span",
        classes: [ "mention" ],
        attributes: [ "data-id", "data-focus" ]
      },
      model: ( viewElement, { writer } ) => {
        let id = viewElement.getAttribute( "data-id" )
        id ??= window.crypto.randomUUID();
        // Always load in with the mention unfocused.
        const focus = false; //viewElement.getAttribute( "data-focus" ) === "true";
        return writer.createElement( "mention", { id, focus });
      }
    } );

    conversion.for( "editingDowncast" ).elementToElement({
      model: "mention",
      view: ( model, { writer } ) => {
        const view = createMentionView( model, writer );

        // For edit view only: decorate with at icon.
        const icon = writer.createEmptyElement( "sl-icon", {
          src: "/icons/at.svg",
          class: "default",
        });
        writer.insert( writer.createPositionAt(view, 0), icon );
        
        // Enable widget handling on an element inside the editing view.
        return toWidget( view, writer );
      }
    });

    // Add a converter for editing downcast pipeline.
    conversion.for( 'editingDowncast' ).add( dispatcher => {
      // Specify converter for attribute `text` on element `dailyNote`.
      dispatcher.on( 'attribute:focus:mention', ( evt, data, conversionApi ) => {
        if ( data.attributeOldValue == data.attributeNewValue ) {
          return;
        }

        // Here, use `data` and `conversionApi.mapper` and `conversionApi.writer`
        // to change the view. You will have to map the changed model element to
        // view element using `conversionApi.mapper` and replace the text
        // using `conversionApi.writer`.

        const view = conversionApi.mapper.toViewElement(data.item);
        conversionApi.writer.setAttribute( "data-focus", data.attributeNewValue.toString(), view );
      });
    });

    conversion.for( "dataDowncast" ).elementToElement( {
      model: "mention",
      view: ( model, { writer } ) => {
        return createMentionView( model, writer );
      }
    });

    // Helper method for both downcast converters.
    function createMentionView( model, writer ) {
      const id = model.getAttribute( "id" );
      const focus = model.getAttribute( "focus" );

      return writer.createContainerElement( "span", {
        class: `mention`,
        "data-id": id,
        "data-focus": focus.toString()
      });
    }
  }
}



class Mention extends Plugin {
  static get requires() {
    return [ MentionEditing ];
  }
}

export {
  Mention
}