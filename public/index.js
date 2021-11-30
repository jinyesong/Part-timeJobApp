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

//console.log(db.collection('customer').doc("1"))

$("#loginBtn").click(function(){
    if($(".idbox").val() == "" || $(".pwbox").val() == ""){
        alert("아이디와 비밀번호를 입력해주세요.");
        return false;
    }
    db.collection('customer').get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        if($('.idbox').val() == doc.data()['email']){
            hasId = true;
          if($('.pwbox').val() == doc.data()['password'] && hasId){
            alert("반갑습니다 " + doc.data()['name'] + "님");
            sessionStorage.setItem("name", doc.data()['name']);
            sessionStorage.setItem("email", doc.data()['email']);
            location.href = "homePage/home.html";
          }
          else if($('.pwbox').val() != doc.data()['password'] && hasId){
              alert("아이디와 비밀번호가 일치하지 않습니다.");
              return false;
          }
        }
    })
    if(hasId == false){
        alert("존재하지않는 아이디입니다.");
    }
  });
  });

$(".idbox").focus(function(){ //idbox가 focusing 되었을 때 밑줄 색이 바뀜
    $(".idbox").css("border-bottom-color", "lightcoral");
  });
$(".idbox").blur(function(){ //idbox가 unfocusing 되었을 때 밑줄 색이 바뀜
    $(".idbox").css("border-bottom-color", "#d9d9d9");
  });
$(".pwbox").focus(function(){ //pwbox가 focusing 되었을 때 밑줄 색이 바뀜
    $(".pwbox").css("border-bottom-color", "lightcoral");
  });
$(".pwbox").blur(function(){ //pwbox가 unfocusing 되었을 때 밑줄 색이 바뀜
    $(".pwbox").css("border-bottom-color", "#d9d9d9");
  });