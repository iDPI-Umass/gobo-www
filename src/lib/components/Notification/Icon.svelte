<script>
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";

  export let name = null;

  let iconURL;

  // TODO: Can we do away with icon nudge hacks?
  let modify = "";

  switch ( name ) {
    case "like":
      iconURL = "/icons/heart-fill.svg";
      modify = "a";
      break;
    case "repost":
      iconURL = "/icons/repeat.svg";
      break;
    case "reply":
      iconURL = "/icons/reply-fill.svg";
      break;
    case "quote":
      iconURL = "/icons/quote.svg";
      break;
    case "follow":
      iconURL = "/icons/person-plus-fill.svg";
      break;
    case "poll complete":
      iconURL = "/icons/check2-circle.svg";
      break;
    case "direct message":
      iconURL = "/icons/envelope-fill.svg";
      break;
    default:
      iconURL = "/icons/question-circle.svg";
  }

</script>

<sl-icon src={iconURL} class="{modify}"></sl-icon>

<style>
  sl-icon {
    font-size: 2rem;
  }

  sl-icon.a {
    margin-top: 0.125rem;
  }
</style>