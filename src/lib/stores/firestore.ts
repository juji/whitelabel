import type { Firestore } from 'firebase/firestore';
import { writable } from 'svelte/store';
export const firestore = writable<Firestore|null>(null);