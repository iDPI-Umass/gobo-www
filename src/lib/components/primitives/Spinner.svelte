<script>
  import "@shoelace-style/shoelace/dist/components/spinner/spinner.js";
</script>

<div class="spinner-box">
  <sl-spinner></sl-spinner>
</div>

<style>
  .spinner-box {
    max-width:  36rem;
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  .spinner-box > sl-spinner {
    font-size: 3rem;
  }
</style>