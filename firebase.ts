
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD2UiUAg6pQxvxiWRP8uXFmmZ7zuakD6wo",
  authDomain: "financeiro-sksb.firebaseapp.com",
  databaseURL: "https://financeiro-sksb-default-rtdb.firebaseio.com",
  projectId: "financeiro-sksb",
  storageBucket: "financeiro-sksb.firebasestorage.app",
  messagingSenderId: "329133327621",
  appId: "1:329133327621:web:8780a6f1bdb8f402d6236c",
  measurementId: "G-V93DKCMD80"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const stateRef = ref(db, 'appState');
