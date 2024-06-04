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


const content = createStore();
const thread = createStore();
const identities = createStore();
const attachments = createStore();
const reply = createStore();
const quote = createStore();
const options = createStore();
const alerts = createStore();

export {
  content,
  thread,
  identities,
  attachments,
  reply,
  quote,
  options,
  alerts
}