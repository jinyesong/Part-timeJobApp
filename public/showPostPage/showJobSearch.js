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
    sessionStorage.removeItem("postId");
  });

$(".homeUserName").html(sessionStorage.getItem("name")); 
// 사이드바 끝

// 게시글 내용 출력
var postId = sessionStorage.getItem("postId");

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
db.collection('jobSearchPost').doc(postId).get().then((doc)=>{
    var title = doc.data().title;
    var content = doc.data().content;
    var writer = doc.data().writerName;
    var workStart = doc.data().workStart;
    var workEnd = doc.data().workEnd;
    var postEnd = doc.data().postEnd;
    var area = doc.data().area;
    var pay = doc.data().pay;
    var gender = doc.data().gender;

    $("#postTitle").html(title);
    $("#postContent").html(content);
    $("#postOtherInfo").html("작성자: "+writer+"<br>근무일: "+workStart+" ~ "+workEnd+"<br>모집 마감일: "+postEnd+"<br>근무지역: "+area+"<br>시급: "+pay+"<br>선호성별: "+gender);

    if(writer == sessionStorage.getItem("name")){
      $("#modifyBtn").attr("disabled", false);
      $("#removeBtn").attr("disabled", false);
      $("#modifyBtn").css("color", "white");
      $("#removeBtn").css("color", "white");
    }
    else{
      $("#modifyBtn").attr("disabled", true);
      $("#removeBtn").attr("disabled", true);
      $("#modifyBtn").css("color", "gray");
      $("#removeBtn").css("color", "gray");
    }
});

$("#backToListBtn").click(function(){
  location.href = "../bulletinBoard/jobSearchBoard.html";
});

$("#removeBtn").click(function(){
  var deleteConfirm = confirm("게시글을 삭제하시겠습니까?");
  if(deleteConfirm == true){
    db.collection('jobOfferPost').doc(postId).delete().then(()=>{
      alert("게시글이 삭제되었습니다");
      location.href = "../bulletinBoard/jobSearchBoard.html";
    })
  }
});

$("#modifyBtn").click(function(){
  location.href = "../modifyPostPage/modifyJobSearchPostPage.html";
});