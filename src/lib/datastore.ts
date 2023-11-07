import { app } from './firebase'
// import { geohashForLocation } from 'geofire-common';
import { 
  getFirestore, 
  collection, 
  addDoc,
  query,
  onSnapshot,
  Firestore,
  orderBy
} from "firebase/firestore";

export function db(){ return getFirestore(app()) }
const dbName = 'locations'

export type Data = {
  id: string
  Location: {
    Lat: number,
    Long: number
  },
  Timestamp: string
}

export async function addLatLng({
  lat, lng, db
}:{
  lat: number,
  lng: number,
  db: Firestore
}){

  try {

    // const hash = geohashForLocation([lat, lng]);
    const docRef = await addDoc(collection(db, dbName), {
      Location: {
        Lat: lat,
        Long: lng,
      },
      Timestamp: new Date().toISOString(),
    });
    // console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  

}

export function subscribe(
  db: Firestore,
  onQuerySnapshot: (a:any) => void,
  onError?: (a:any) => void
){

  const q = query(collection(db, dbName), orderBy('Timestamp', 'asc'))
  
  // unsubscribe
  return onSnapshot(q, onQuerySnapshot, onError? onError : (e:any) => {
    console.error(e)
  })

}