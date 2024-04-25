import { writable } from "svelte/store";

const createStore = () => {
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
const onboardFailure = createStore();

export {
  singleton,
  onboardFailure
}