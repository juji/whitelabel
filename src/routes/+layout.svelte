<script lang="ts">
  import { PUBLIC_GMAP_API_KEY } from '$env/static/public'
  import { onMount } from "svelte";
  import { map } from '$lib/stores/map-loaded'
  import { firestore } from '$lib/stores/firestore'
  import { db } from '$lib/datastore'

  let src: string;
  onMount(() => {
    
    // set google map
    Object.assign(window, {
      $MapLoaded: () => {
        map.set(true)
      }
    })
    src = `https://maps.googleapis.com/maps/api/js?key=${PUBLIC_GMAP_API_KEY}&callback=$MapLoaded` 
    
    // set firestore
    firestore.set(db())
    
  })

  
</script>

<style global>
  @import 'sanitize.css';
  @import '$lib/styles/global.css';
</style>

<svelte:head>
  {#if src}
  <script defer async src={src}></script>
  {/if}
</svelte:head>

<slot />