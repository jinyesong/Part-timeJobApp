/* 사이드바 */
function openSlideMenu(){
    document.getElementById('menu').style.width = '260px';
    document.getElementById('page').style.marginRight = '260px';
  }
  function closeSlideMenu(){
    document.getElementById('menu').style.width = '0';
    document.getElementById('page').style.marginRight = '0';
  }

  $("#logoutBtn").click(function(){
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("email");
    location.href = "../index.html";
  });

  $(".homeUserName").html(sessionStorage.getItem("name")); 
// 사이드바 끝

// 게시글 내용 출력
var postId = sessionStorage.getItem("postId");
sessionStorage.removeItem("postId");

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
db.collection('jobOfferPost').doc(postId).get().then((doc)=>{
    var title = doc.data().title;
    var content = doc.data().content;
    var writer = doc.data().writerName;
    var workStart = doc.data().workStart;
    var workEnd = doc.data().workEnd;
    var postEnd = doc.data().postEnd;
    var area = doc.data().area;
    var pay = doc.data().pay;
    var gender = doc.data().gender;
    var payBoost = doc.data().payBoost;

    if(writer == sessionStorage.getItem("name")){
      // document.getElementById("modifyBtn").setAttribute("disabled", "false");
      $("#modifyBtn").attr("disabled", false);
      $("#removeBtn").attr("disabled", false);
    }
    else{
      $("#modifyBtn").attr("disabled", true);
      $("#removeBtn").attr("disabled", true);
    }

    if(payBoost = true){
      var increaseRate = doc.data().increaseRate;
      var deadline = doc.data().deadline;
      
    }
});

$("#backToListBtn").click(function(){
  location.href = "../bulletinBoard/jobOfferBoard.html";
});