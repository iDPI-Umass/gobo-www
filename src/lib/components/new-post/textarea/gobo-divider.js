import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { Command, Plugin } from "@ckeditor/ckeditor5-core";
import DomEventObserver from "@ckeditor/ckeditor5-engine/src/view/observer/domeventobserver";
import { 
  Widget,
  toWidget,
  viewToModelPositionOutsideModelElement
} from "@ckeditor/ckeditor5-widget";

// editor.execute("gobo-divider", {value: "bluesky"})

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


class AddDividerCommand extends Command {
  execute({ value }) {
      const editor = this.editor;
      const selection = editor.model.document.selection;

      editor.model.change( writer => {
          // Create a <gobo-divider> element with the "platform" attribute (and all the selection attributes)...
          const divider = writer.createElement( "gobo-divider", {
              ...Object.fromEntries( selection.getAttributes() ),
              platform: value
          } );

          // ... and insert it into the document. Put the selection on the inserted element.
          editor.model.insertObject( divider, null, null, { setSelection: "on" } );
      } );
  }

  refresh() {
      const model = this.editor.model;
      const selection = model.document.selection;
      const isAllowed = model.schema.checkChild( selection.focus.parent, "gobo-divider" );
      this.isEnabled = isAllowed;
  }
}

class RemoveDividerCommand extends Command {
  execute({ target }) {
    this.editor.model.change( writer => {
      writer.remove( target );
    });
  }

  refresh() {
      const model = this.editor.model;
      const selection = model.document.selection;
      const isAllowed = model.schema.checkChild( selection.focus.parent, "gobo-divider" );
      this.isEnabled = isAllowed;
  }
}


Helpers.matchDivider = ( editor, target ) => {
  if ( target.hasClass("gobo-divider") ) {
    return editor.editing.mapper.toModelElement( target );
  }
  if ( target.parent.hasClass("gobo-divider") ) {
    return editor.editing.mapper.toModelElement( target.parent );
  }
  return;
};

export default class GoboDividerEditing extends Plugin {
  static get requires() {
    return [ Widget ];
  }

  init() {
    this._defineSchema(); 
    this._defineConverters();
    
    this.editor.commands.add( 
      "add-divider",
      new AddDividerCommand( this.editor )
    );
    this.editor.commands.add( 
      "remove-divider",
      new RemoveDividerCommand( this.editor )
    );

    this.editor.editing.mapper.on(
      "viewToModelPosition",
      viewToModelPositionOutsideModelElement( 
        this.editor.model, 
        viewElement => viewElement.hasClass( "gobo-divider" ) 
      )
    );

    const editor = this.editor;
    const view = this.editor.editing.view;
    view.addObserver( DoubleClickObserver );    
    this.editor.listenTo( view.document, "dblclick", ( evt, data ) => {
      const match = Helpers.matchDivider( editor, data.target );
      if ( match != null ) {
        editor.execute( "remove-divider", { target: match });
      }
    });

    window.editor = editor;
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register( "gobo-divider", {
      // Behaves like a self-contained inline object (e.g. an inline image)
      // allowed in places where $text is allowed (e.g. in paragraphs).
      // The inline widget can have the same attributes as text 
      // (for example linkHref, bold).
      inheritAllFrom: "$inlineObject",

      // The divider can have many types, like date, name, surname, etc:
      allowAttributes: [ "platform" ]
    } );
  }

  _defineConverters() {
    const conversion = this.editor.conversion;


    conversion.for( "upcast" ).elementToElement( {
      view: {
        name: "span",
        classes: [ "gobo-divider" ]
      },
      model: ( viewElement, { writer } ) => {
        const platform = viewElement.getAttribute( "data-platform" );
        return writer.createElement( "gobo-divider", { platform } );
      }
    } );


    conversion.for( "editingDowncast" ).elementToElement( {
      model: "gobo-divider",
      view: ( model, { writer } ) => {
        const view = createGoboDividerView( model, writer );

        // For edit view only: decorate with platform icon.
        const platform = model.getAttribute( "platform" );
        const icon = writer.createEmptyElement( "sl-icon", {
          src: `/icons/${platform}.svg`,
          class: platform
        });
        writer.insert( writer.createPositionAt( view, 0 ), icon );
        
        // Enable widget handling on an element inside the editing view.
        return toWidget( view, writer );
      }
    } );


    conversion.for( "dataDowncast" ).elementToElement( {
      model: "gobo-divider",
      view: ( model, { writer } ) => {
        return createGoboDividerView( model, writer );
      }
    });


    // Helper method for both downcast converters.
    function createGoboDividerView( model, writer ) {
      const platform = model.getAttribute( "platform" );

      return writer.createContainerElement( "span", {
        class: "gobo-divider",
        "data-platform": platform
      });
    }
  }
}



class GoboDivider extends Plugin {
  static get requires() {
    return [ GoboDividerEditing ];
  }
}

export {
  GoboDivider
}