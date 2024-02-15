<script>
  import { humanize } from "$lib/helpers/humanize.js";
  import * as h from "$lib/engines/post.js";

  export let notified;

  export let id;
  export let platform;
  export let base_url;
  export let url;
  export let username = null;
  export let name = null;
  export let icon_url = null;

  export let platform_id;
  export let active;
  export let created;
  export let updated;
  let unused = [ 
    id, 
    base_url, 
    url,
    platform_id, 
    active,
    created,
    updated
  ];


  let logo = h.getLogo( platform );
  let { headingSlot1, headingSlot2 } = 
    h.getHeadingSlots({ platform, name, username });
  let avatar = h.getAvatar({ icon_url, platform });
  let avatarFallback = h.getAvatarFallback({ icon_url, platform });

</script>


<section>
  <img 
    src="{avatar}" 
    alt={`avatar for ${ headingSlot1 }`}
    onerror="this.onerror=null;this.src='{avatarFallback}'"
  >

  <header>
    <div class="names">
      <div class="slot1">{ headingSlot1 }</div>
      {#if headingSlot2}
        <div class="slot2">{ headingSlot2 }</div>
      {/if}
    </div>
    <time datetime="notified">{ humanize( notified ) }</time>
  </header>

</section>

<style>

  section {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
    background-color: var(--gobo-color-panel);
    border-radius: var(--gobo-border-radius);
    border: var(--gobo-border-panel);
  }

  @media ( max-width: 680px ) {
    section {
      border-radius: 0;
      border-left: none;
      border-right: none;
    }
  }

  img {
    height: 2.8125rem;
    width: 2.8125rem;
    border-radius: var(--sl-border-radius-circle);
    margin-right: var(--gobo-width-spacer-half);
    border: var(--gobo-border-panel);
  }

  header {
    flex: 1;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  header .names {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    min-width: 0;
  }

  header .slot1 {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-bold);
    color: var(--gobo-color-text);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-right: 0.75rem;
  }

  header .slot2 {
    font-size: var(--gobo-font-size-copy);
    font-weight: var(--gobo-font-weight-regular);
    color: var(--gobo-color-text-muted);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  header time {
    flex-shrink: 0;
    font-size: var(--gobo-font-size-detail);
    font-weight: var(--gobo-font-weight-regular);
    color: var(--gobo-color-text-muted);
    min-width: max-content;
    margin-left: 0.75rem;
  }

</style>


