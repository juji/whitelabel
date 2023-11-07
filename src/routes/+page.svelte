<script lang="ts">
  import { map as mapLoaded } from '$lib/stores/map-loaded'
  import { db, addLatLng, subscribe, type Data } from '$lib/datastore'
	import type { Firestore } from 'firebase/firestore';
	import { onMount } from 'svelte';

  let mapElm:HTMLDivElement;
  let zoom = 11;

  // Tangerang, Indonesia
  let lat = -6.178306
  let lng = 106.631889

  let map: google.maps.Map;
  let data: Data[] = [];
  let firestore:Firestore;
  let markers: {[id: string]: google.maps.Marker} = {};

  const initMap = () => {
    map = new google.maps.Map(  
      mapElm, {  
        zoom,  
        center: {lat, lng}  
      }
    );

    map.addListener('click', async (mapsMouseEvent: any) => {
      await addLatLng({
        lat: mapsMouseEvent.latLng.lat(),
        lng: mapsMouseEvent.latLng.lng(),
        db: firestore
      })
    })
  }

  $: if($mapLoaded && mapElm){
    console.log('mapLoaded', $mapLoaded)
    initMap()
  }

  onMount(() => {
    firestore = db()
    const unsub = subscribe(firestore, (querySnapshot) => {
      const dat:Data[] = []
      querySnapshot.forEach((doc:any) => {
        dat.push({
          id: doc.id,
          ...doc.data()
        })
      });
      data = dat
    })
    return () => unsub()
  })

  $: {
    // console.log('data', data);
    // (markers||[]).forEach(marker => marker.setMap(null));
    
    // removal first 
    const markerIds = data.reduce((a,b) => {
      a[b.id] = true
      return a
    },{} as {[id: string]: boolean})

    Object.keys(markers).forEach(id => {
      if(!markerIds[id]) {
        markers[id].setMap(null)
        delete markers[id]
      }
    })

    let label = Object.keys(markers||{}).length;
    
    data.forEach(marker => {
      if(markers[marker.id]) return;
      else markers[marker.id] = new google.maps.Marker({
        position: {
          lat: marker.Location.Lat,
          lng: marker.Location.Long
        },
        map,
        label: (label++) + ''
      })
    })

    
  }

</script>

<div bind:this={mapElm}></div>


<style>
  div{
    min-height: 100%;
  }
</style>