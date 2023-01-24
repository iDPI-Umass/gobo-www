<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte"
  import Center from "$lib/components/layouts/Center.svelte"
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import { sleep } from "@dashkite/joy/time";
  let form, button;

  const validate = function() {
    return form.reportValidity();  
  };

  const issueRequest = async function () {
    console.log( "HTTP request goes here..." );
    await sleep( 500 );
  };

  const submit = async function () {
    const isValid = validate();
    if ( isValid === true ) {
      await issueRequest();
      form.reset();
      button.loading = false;
      goto( "/identities" );
    } else {
      button.loading = false;
    }
  };

  onMount(() => {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      if ( button.loading !== true ) {
        button.loading = true;
        submit();
      }
    });
  });
</script>

<MainHeader></MainHeader>
<Center>
  <h1>Why Am I Seeing This?</h1>
  
    
  
  
</Center>


<style>
  form {
    flex: 1 1 100%;
    max-width: 30rem;
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

  form > h2 {
    font-size: var(--sl-font-size-large);
    margin-bottom: 1rem;
  }

  section.buttons {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    margin: 1rem 0 0 0;
  }
</style>