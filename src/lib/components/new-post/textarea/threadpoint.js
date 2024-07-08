import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { Command, Plugin } from "@ckeditor/ckeditor5-core";
import DomEventObserver from "@ckeditor/ckeditor5-engine/src/view/observer/domeventobserver";
import { 
  Widget,
  toWidget,
  viewToModelPositionOutsideModelElement
} from "@ckeditor/ckeditor5-widget";

// editor.execute("add-threadpoint", {value: "bluesky"})

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


class AddThreadpointCommand extends Command {
  execute({ value }) {
    const editor = this.editor;
    const selection = editor.model.document.selection;

    editor.model.change( writer => {
      const position = editor.model.document.selection.getFirstPosition();  
      
      // Create a threadpoint model element...
      const threadpoint = writer.createElement( "threadpoint", {
        ...Object.fromEntries( selection.getAttributes() ),
        platform: value,
        id: window.crypto.randomUUID()
      });

      // ...and insert it into the document model.
      editor.model.insertObject( threadpoint, null, null, { setSelection: "on" } );

      // Set the selection position back to its former value.
      writer.setSelection( position );
    });
  }

  refresh() {
    this.isEnabled = true;
  }
}

class RemoveThreadpointCommand extends Command {
  execute({ target }) {
    this.editor.model.change( writer => {
      writer.remove( target );
    });
  }

  refresh() {
    this.isEnabled = true;
  }
}


Helpers.matchThreadpoint = ( editor, target ) => {
  if ( target.hasClass("threadpoint") ) {
    return editor.editing.mapper.toModelElement( target );
  }
  if ( target.parent.hasClass("threadpoint") ) {
    return editor.editing.mapper.toModelElement( target.parent );
  }
  return;
};

export default class ThreadpointEditing extends Plugin {
  static get requires() {
    return [ Widget ];
  }

  init() {
    this._defineSchema(); 
    this._defineConverters();
    
    this.editor.commands.add( 
      "add-threadpoint",
      new AddThreadpointCommand( this.editor )
    );
    this.editor.commands.add( 
      "remove-threadpoint",
      new RemoveThreadpointCommand( this.editor )
    );

    this.editor.editing.mapper.on(
      "viewToModelPosition",
      viewToModelPositionOutsideModelElement( 
        this.editor.model, 
        viewElement => viewElement.hasClass( "threadpoint" ) 
      )
    );

    const editor = this.editor;
    const view = this.editor.editing.view;
    view.addObserver( DoubleClickObserver );    
    this.editor.listenTo( view.document, "dblclick", ( evt, data ) => {
      const match = Helpers.matchThreadpoint( editor, data.target );
      if ( match != null ) {
        editor.execute( "remove-threadpoint", { target: match });
      }
    });

    window.editor = editor;
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register( "threadpoint", {
      // Behaves like a self-contained inline object (e.g. an inline image)
      // allowed in places where $text is allowed (e.g. in paragraphs).
      // The inline widget can have the same attributes as text 
      // (for example linkHref, bold).
      inheritAllFrom: "$inlineObject",

      // The widget can have many types, like date, name, surname, etc:
      allowAttributes: [ "id", "platform" ]
    } );
  }

  _defineConverters() {
    const conversion = this.editor.conversion;

    conversion.for( "upcast" ).elementToElement( {
      view: {
        name: "span",
        classes: [ "threadpoint" ],
        attributes: [ "data-id", "data-platform" ]
      },
      model: ( viewElement, { writer } ) => {
        let id = viewElement.getAttribute( "data-id" )
        id ??= window.crypto.randomUUID();
        const platform = viewElement.getAttribute( "data-platform" );
        return writer.createElement( "threadpoint", { id, platform });
      }
    } );

    conversion.for( "editingDowncast" ).elementToElement({
      model: "threadpoint",
      view: ( model, { writer } ) => {
        const view = createThreadpointView( model, writer );

        // For edit view only: decorate with platform icon.
        const platform = model.getAttribute( "platform" );
        const icon = writer.createEmptyElement( "sl-icon", {
          src: `/icons/${platform}.svg`,
          class: platform
        });
        writer.insert( writer.createPositionAt(view, 0), icon );
        
        // Enable widget handling on an element inside the editing view.
        return toWidget( view, writer );
      }
    } );

    conversion.for( "dataDowncast" ).elementToElement( {
      model: "threadpoint",
      view: ( model, { writer } ) => {
        return createThreadpointView( model, writer );
      }
    });

    // Helper method for both downcast converters.
    function createThreadpointView( model, writer ) {
      const id = model.getAttribute( "id" );
      const platform = model.getAttribute( "platform" );

      return writer.createContainerElement( "span", {
        class: "threadpoint",
        "data-id": id,
        "data-platform": platform
      });
    }
  }
}



class Threadpoint extends Plugin {
  static get requires() {
    return [ ThreadpointEditing ];
  }
}

export {
  Threadpoint
}