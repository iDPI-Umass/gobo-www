import * as Type from "@dashkite/joy/type";
import * as FileHTTP from "$lib/resources/draft-file.js";
import { PUBLIC_GOBO_API } from '$env/static/public';

const isFile = Type.isType( File );



class DraftFile {
  constructor( _, url ) {
    this._ = _;
    this.url = `${ PUBLIC_GOBO_API }/people/${ _.person_id }/draft-files/${ _.id }`;
  }

  get id() {
    return this._.id
  }

  get name() {
    return this._.name;
  }

  get alt() {
    return this._.alt;
  }

  get type() {
    return this._.mime_type;
  }

  get size() {
    return this._.size;
  }

  set name( value ) {
    this._.name = value;
  }

  set alt( value ) {
    this._.alt = value;
  }

  set mime_type( value ) {
    this._.mime_type = value;
  }

  static isType( value ) {
    return Type.isType( DraftFile, value );
  }

  static async fromFile ( file ) {
    const _ = await FileHTTP.create();
    _.mime_type = file.type;
    _.name = file.name;
    _.size = file.size;
    _.alt = null;

    const draftFile = new DraftFile( _ );
    draftFile.file = file;
    draftFile.url = URL.createObjectURL( file );
    return draftFile
  }

  // Upload also updates the file metadata. If we don't need to upload the file,
  // we should still issue a PUT on the metadata to make sure it's synced.
  async upload() {
    if ( this.file != null ) {
      await FileHTTP.upload( this.file, this._ );
    } else {
      await FileHTTP.update( this._ );
    }
  }

  async fail () {
    this._.state = "error"
    try {
      await FileHTTP.update( this._ );
    } catch ( error ) {
      console.error( error );
    }
  }

  destroy () {
    if ( this.file != null ) {
      URL.revokeObjectURL( this.url );
    }
  }
}


export {
  DraftFile
}