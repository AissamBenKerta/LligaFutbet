import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Tu configuración de Firebase (copia los valores de Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyD2LV894PY4g1UvgqjDy78jkQHzELIkXCU",
  authDomain: "ligafutsalsbd.firebaseapp.com",
  projectId: "ligafutsalsbd",
  storageBucket: "ligafutsalsbd.firebasestorage.app",
  messagingSenderId: "901943195299",
  appId: "1:901943195299:web:2b92b1759fd5c84e35b116"
};

// Inicializar Firebase
const firebaseApp  = initializeApp(firebaseConfig);

// Inicializar Firestore (base de datos)
const db = getFirestore(firebaseApp);

// Inicializar Authentication
const auth = getAuth(firebaseApp);

export { firebaseApp, db, auth };
