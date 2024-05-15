import { writable } from "svelte/store";

const createStore = function ( value ) {
  let event = value ?? null;

  const { subscribe, update } = writable( event );

  return {
    subscribe,
    put: ( value ) => {
      update(() => value );
    },
  };
};

class State {
  constructor() {
    this.closers = [];
    this.cleanup = function () {};
  }

  static make () {
    return new State();
  }

  listen ( store, f ) {
    const g = ( value ) => {
      if ( value == null ) {
        return;
      } else {
        return f( value );
      }
    };

    let closeFunction = store.subscribe( g );
    this.closers.push( closeFunction );
    return;
  }

  // Handles sundry tasks when destroying a component.
  reset () {
    // Release Svelte store subscriptions using the collected closers.
    for ( const close of this.closers ) {
      close();
    }
    this.closers = [];    
    this.cleanup();
  }
}


export {
  createStore,
  State
}