<script lang="ts">
  import { map as mapLoaded } from '$lib/stores/map-loaded'
  import { addLatLng, subscribe, type Data } from '$lib/datastore'
	import { onMount } from 'svelte';
  import { firestore } from '$lib/stores/firestore'
	import type { Firestore } from 'firebase/firestore';

  let mapElm:HTMLDivElement;
  let zoom = 11;

  // Tangerang, Indonesia
  let lat = -6.178306
  let lng = 106.631889
  let unsub:() => void;
  let map: google.maps.Map;
  let data: Data[] = [];
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
        db: $firestore as Firestore
      })
    })
  }

  $: if($mapLoaded && mapElm){
    console.log('mapLoaded', $mapLoaded)
    initMap()
  }

  $: if($firestore){
    unsub = subscribe($firestore, (querySnapshot) => {
      const dat:Data[] = []
      querySnapshot.forEach((doc:any) => {
        dat.push({
          id: doc.id,
          ...doc.data()
        })
      });
      data = dat
    })
  }

  onMount(() => {
    return () => unsub && unsub()
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

    data.forEach((marker,i) => {
      if(markers[marker.id]) 
        markers[marker.id].setLabel((i+1) + '')
      else markers[marker.id] = new google.maps.Marker({
        position: {
          lat: marker.Location.Lat,
          lng: marker.Location.Long
        },
        map,
        label: (i+1) + ''
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