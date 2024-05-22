import * as Type from "@dashkite/joy/type";
import * as FileHTTP from "$lib/resources/draft-file.js";
import { PUBLIC_GOBO_API } from '$env/static/public';

const isFile = Type.isType( File );



class DraftFile {
  constructor( _, url ) {
    this._ = _;
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

  get state() {
    return this._.state
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

  static make( _ ) {
    const draftFile = new DraftFile( _ );
    draftFile.url = draftFile.buildURL();
    return draftFile;
  }

  static async fromFile ( file ) {
    const _ = {};
    _.mime_type = file.type;
    _.name = file.name;
    _.size = file.size;
    _.alt = null;

    const draftFile = new DraftFile( _ );
    draftFile.file = file;
    draftFile.url = URL.createObjectURL( file );
    return draftFile
  }

  buildURL() {
    const { person_id, id } = this._;
    return `${ PUBLIC_GOBO_API }/people/${ person_id }/draft-files/${ id }`;
  }

  // If this instance doesn't yet have a corresponding representation in the
  // Gobo HTTP API, we create one here. This representation must be available
  // for other resources that make up the publication graph.
  async create() {
    if ( this.id == null ) {
      const resource = await FileHTTP.create( this._ );
      this._.id = resource.id;
    }
  }

  // Upload also updates the file metadata. If we don't need to upload the file,
  // we should still issue a PUT on the metadata to make sure it's synced.
  async upload() {
    if ( this.file != null ) {
      this._ = await FileHTTP.upload( this.file, this._ );
      this.url = this.buildURL();
      this.revoke();
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

  revoke () {
    if ( this.file != null ) {
      URL.revokeObjectURL( this.url );
      this.file = null;
    }
  }
}


export {
  DraftFile
}