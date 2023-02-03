<script>
  export let active = false;
  export let platform = null;
  export let account = null;
</script>

<div class="identity">
  <sl-switch
    checked={active}
    size="medium">
  </sl-switch>
  <sl-icon src="/icons/{platform}.svg" style="color:var(--gobo-{platform});"></sl-icon>
  {account}
</div>