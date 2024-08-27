// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSblqJ71X-egndVQrAjDdqooyvrF4PpPk",
  authDomain: "flashcardsaas-4ae2b.firebaseapp.com",
  projectId: "flashcardsaas-4ae2b",
  storageBucket: "flashcardsaas-4ae2b.appspot.com",
  messagingSenderId: "22274890642",
  appId: "1:22274890642:web:b8d9ce9404aa1ef863bf4b",
  measurementId: "G-DZM0GGJ6GS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);