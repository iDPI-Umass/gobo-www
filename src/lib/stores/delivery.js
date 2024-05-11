import { writable } from "svelte/store";

const createStore = function () {
  let event = null;

  const { subscribe, update } = writable( event );

  return {
    subscribe,
    put: ( value ) => {
      update(() => value );
    },
  };
};


const singleton = createStore();
const uploads = createStore();
const draft = createStore();
const targets = createStore();
const alerts = createStore();

export { 
  singleton,
  uploads,
  draft,
  targets,
  alerts
}