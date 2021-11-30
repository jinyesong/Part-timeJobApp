var firebaseConfig = {
    apiKey: "AIzaSyCqJYyU3LacLWMFjix0SfgZt0Ajsuo5c-Q",
    authDomain: "part-time-job-38ba6.firebaseapp.com",
    projectId: "part-time-job-38ba6",
    storageBucket: "part-time-job-38ba6.appspot.com",
    messagingSenderId: "107342558639",
    appId: "1:107342558639:web:f0e8e5c3845e6ed667eb5a"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
  db.collection('customer').get().then((snapshot)=>{
    snapshot.forEach((doc)=>{
      console.log(doc.data())
    })
  });

// import { doc, updateDoc } from "firebase/firestore";

// var name = document.getElementsByName("userName").value
// var email = document.getElementsByName("userId").value
// var pw = document.getElementsByName("userPW").value
// var pw2 = document.getElementsByName("userPW2").value
// var addr = document.getElementsByName("userAddr").value
// var birth = document.getElementsByName("userBirthday").value
// var phoneNum = document.getElementsByName("userphoneNumber").value
// console.log(name)

// const addRef = doc(db, 'hi', 'customer');

// // Set the "capital" field of the city 'DC'
// await updateDoc(addRef, {
//   test:'good'
// });