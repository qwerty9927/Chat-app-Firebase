import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getDoc, getDocs, getFirestore } from 'firebase/firestore'

const app = initializeApp({
    apiKey: "AIzaSyBaxD7j1QyViRjlXj--9ZItgEpvI0SOGok",
    authDomain: "chat-app-3c438.firebaseapp.com",
    projectId: "chat-app-3c438",
    storageBucket: "chat-app-3c438.appspot.com",
    messagingSenderId: "405900879994",
    appId: "1:405900879994:web:4c2e8f5f81dcfdde3c73c3",
    measurementId: "G-9N04VYRXHZ"
})

export const auth = getAuth(app);
export const db = getFirestore(app);
// connectAuthEmulator(auth, "http://localhost:9099")
// connectFirestoreEmulator(db, "localhost", 8080)

