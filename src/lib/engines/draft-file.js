import * as Type from "@dashkite/joy/Type";
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

  static async fromFile ( file ) {
    const _ = await FileHTTP.create();
    _.mime_type = file.type;
    _.name = file.name;
    _.size = file.size;
    _.alt = null;

    const draftFile = new DraftFile( _ );
    draftFile.file = file;
    return draftFile
  }

  async upload() {
    if ( this.file != null ) {
      await FileHTTP.upload( this.file, this._ );
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
}