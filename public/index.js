var firebaseConfig = {
    apiKey: "AIzaSyCqJYyU3LacLWMFjix0SfgZt0Ajsuo5c-Q",
    authDomain: "part-time-job-38ba6.firebaseapp.com",
    projectId: "part-time-job-38ba6",
    storageBucket: "part-time-job-38ba6.appspot.com",
    messagingSenderId: "107342558639",
    appId: "1:107342558639:web:f0e8e5c3845e6ed667eb5a"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
var hasId = false;
$("#loginBtn").click(function(){
    db.collection('customer').get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        if($('.idbox').val() == doc.data()['email']){
            hasId = true;
          if($('.pwbox').val() == doc.data()['password']){
            alert("반갑습니다 " + doc.data()['name'] + "님");
            location.href = "homePage/home.html";
          }
          else{
              alert("아이디와 비밀번호가 일치하지 않습니다.");
          }
        }
    })
    if(hasId == false){
        alert("존재하지않는 아이디입니다.");
    }
  });
  })