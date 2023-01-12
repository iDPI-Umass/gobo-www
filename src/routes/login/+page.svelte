<script>
  import PlainHeader from "$lib/components/PlainHeader.svelte"
  import Login from "$lib/components/Login.svelte"
</script>

<PlainHeader></PlainHeader>

<div class="panels">
  <div class="left-panel">
    <Login></Login>
  </div>
  
  <div class="right-panel">
    <div class="fascinator"></div>
  </div>
</div>

<style>
  .panels {
    height: 100%;
    margin: 0 1rem 1rem 1rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
  }

  .left-panel {
    padding: 0 1rem 0 1rem;
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
  }

  .right-panel {
    padding: 0 1rem 0 1rem;
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
  }

  @media ( max-width: 680px ) {
    .right-panel {
      display: none;
    }
  }

  .fascinator {
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 24.1% 68.8%, rgb(50, 50, 50) 0%, rgb(0, 0, 0) 99.4%);
    /* background: radial-gradient(at left bottom, rgb(55, 65, 81), rgb(17, 24, 39), rgb(0, 0, 0)); */
    border-radius: var(--sl-border-radius-small);
  }
  
</style>
