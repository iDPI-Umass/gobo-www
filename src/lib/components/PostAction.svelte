<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
  import { createEventDispatcher } from "svelte";

  export let name;
  export let isActive
  
  
  const dispatch = createEventDispatcher();

  const toggle = async function () {
    dispatch( "toggle", { name } );
  }

  const handle = async function (event) {
    if ( event.type === "keypress" ) {
        if ( event.key === "Enter" ) {
          await toggle();
        }
      } else {
        await toggle();
      }
  };


  let iconURL;
  iconURL = "/icons/heart.svg";
  switch ( name ) {
    case "like":
      iconURL = "/icons/heart.svg";
      break;
    case "repost":
      iconURL = "/icons/arrow-repeat.svg";
      break;
    case "reply":
      iconURL = "/icons/reply-fill.svg";
      break;
    case "quote":
      iconURL = "/icons/quote.svg";
      break;
    case "upvote":
      iconURL = "/icons/chevron-double-up.svg";
      break;
    case "downvote":
      iconURL = "/icons/chevron-double-down.svg";
      break;
    default:
      throw new Error("unknown proxy action, unable to assign button icon");
  }

</script>


<sl-tooltip content={name}>
  
  <sl-button
    on:click={handle}
    on:keypress={handle}
    circle
    size="small"
    class="{isActive ? "submit" : "hollow"} {name}">
    
    <sl-icon src={iconURL} label="{name}"></sl-icon>
  
  </sl-button>

</sl-tooltip>


<style>
  sl-icon {
    font-size: 16px;
  }

  sl-button.like::part(label) {
    padding-top: 4px;
  }
  sl-button.reply::part(label) {
    padding-top: 1px;
  }
  sl-button.repost::part(label) {
    padding-top: 2px;
  }
  sl-button.quote::part(label) {
    padding-top: 2px;
  }
  sl-button.upvote::part(label) {
    padding-top: 2px;
  }
  sl-button.downvote::part(label) {
    padding-top: 3px;
  }
</style>


