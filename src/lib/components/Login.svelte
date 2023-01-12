<script>
  import '@shoelace-style/shoelace/dist/components/input/input.js';
  import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
  import '@shoelace-style/shoelace/dist/components/button/button.js';
  import '@shoelace-style/shoelace/dist/components/divider/divider.js';
</script>

<form>
  <h1>Log In To Your Account</h1>

  <sl-input 
    name="username" 
    label="Email address or username"
    size="medium"
    required>
  </sl-input>
  
  <sl-input
    class="password-helper" 
    name="password" 
    label="Password" 
    type="password"
    placeholder="Password"
    size="medium" 
    required 
    password-toggle>

    <p slot="help-text" style="font-size: var(--sl-font-size-small);">
      <a
        href="/password-recovery">
        Forgot your password?
      </a>
    </p>
  </sl-input>

  <sl-checkbox
    size="medium">
    Remember me
  </sl-checkbox>

  <sl-button 
    variant="primary"
    size="medium"
    width="100%">
    Login
  </sl-button>

  <sl-divider></sl-divider>

  <p>
    New to GOBO? 
    <a href="/create-account">
      Create an Account
    </a>
  </p>
</form>

<style>
  form {
    width: 20rem;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
  }

  form > * {
    margin-bottom: 2rem;
  }

  form > h1 {
    font-size: var(--sl-font-size-x-large);
  }

  form > sl-input:focus {
    box-shadow: none;
  }

  .password-helper::part(form-control) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  form > sl-divider {
    --width: 1px;
    --color: var(--sl-color-neutral-400);
    margin: 2rem 0 1rem 0;
  }

  /*
    Shoelace wants to place the help-text underneath the input and 
    left-justify it. It exposes CSS parts to apply custom styling. Below
    is a re-ordering with a flexbox techinque, but it's not general. It
    only works because of how the login is constrained.
  */
  .password-helper::part(form-control-label) {
    order: 0
  }

  .password-helper::part(form-control-help-text) {
    order: 1;
    flex: 1 0 67%;
    text-align: right;
  }

  .password-helper::part(form-control-input) {
    order: 2;
    width: 100%
  }


</style>