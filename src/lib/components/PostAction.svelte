<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";

  export let platform;
  export let action;
  export let isActive = false;
  
  let actionButton;

  const toggleSocialEdge = async function () {
    console.log("toggle social action");
  };

  const handle = async function (event) {
    if ( event.type === "keypress" ) {
        if ( event.key === "Enter" ) {
          await toggleSocialEdge();
        }
      } else {
        await toggleSocialEdge();
      }
  };


  let iconURL;
  iconURL = "/icons/heart.svg";
  switch (action) {
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


<sl-tooltip content={action}>
  
  <sl-button
    bind:this={actionButton}
    on:click={handle}
    on:keypress={handle}
    circle
    size="small"
    class="{isActive ? "active" : "hollow"}">
    
    <sl-icon src={iconURL} label="{action}"></sl-icon>
  
  </sl-button>

</sl-tooltip>


<style>
  sl-icon {
    font-size: 1rem;
  }

  sl-button::part(label) {
    display: flex;
    align-items: center;
  }
</style>


