<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import Center from "$lib/components/layouts/Center.svelte"
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { App } from "$lib/engines/account.js";
  import { Actions } from "$lib/engines/actions.js";

  // TODO: Do we want to handle verification email resend from here?
  // We have an endpoint configured in the API, but it's a spam vector
  // here for unverified personas without some extra protections.

  let sendButton;
  let state;
  const Render = State.make();
  Render.cleanup = () => {
    state = "ready";
  };


  const Handle = {};

  Handle.logout = async ( event ) => {
    await App.logout();
  };

  Handle.resend = async ( event ) => {
    if ( sendButton.loading === true ) {
      return;
    }
    sendButton.loading = true;
    
    try {
      await Actions.resendEmailVerification();
      state = "success";
    } catch (error) {
      console.error( error );
      state = "failure";
    }

    sendButton.loading = false;
  };

  Handle.dismiss = ( event ) => {
    event.preventDefault();
    state = "ready";
  };


  Render.reset();
  onMount(() => {
    return () => {
      Render.reset();
    };
  });

</script>

<PlainHeader></PlainHeader>
<Center>
  <div class="main-child">

    <section class="gobo-copy">
      <h1>Gobo Requires Email Verification</h1>
      <p>
        In order to use Gobo, you'll need to first verify your email address.
        You should have gotten an email containing a verification request when
        you signed up. Click the verify link in that email, and then you'll be
        granted full access to your Gobo account.
      </p>

      <!-- {#if state === "success"}
        <sl-alert variant="success" open closable on:sl-hide={Handle.dismiss}>
          <sl-icon slot="icon" src="/icons/check2-circle.svg"></sl-icon>
          Successfully sent verification email.
        </sl-alert>
      {:else if state === "failure"}
        <sl-alert variant="danger" open closable on:sl-hide={Handle.dismiss}>
          <sl-icon slot="icon" src="/icons/exclamation-circle.svg"></sl-icon>
          There was a problem sending the verification email.
        </sl-alert>
      {/if} -->

      <div class="buttons">
        <!-- svelte-ignore a11y-click-events-have-key-events
        <sl-button
          bind:this={sendButton}
          on:click={Handle.resend}
          class="action"
          size="medium"
          pill>
          Resend Verification
        </sl-button> -->

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <sl-button
          on:click={Handle.logout}
          class="submit"
          size="medium"
          pill>
          Logout
        </sl-button>
      </div>
      
    </section>
  </div>
  
</Center>


<style>
  sl-alert {
    margin-top: 1rem;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-end;
    align-items: center;
    margin-top: 2rem;
    border-top: none;
    padding-top: 0;
  }

  .buttons sl-button {
    margin-bottom: 0;
    width: 10rem;
  }
</style>