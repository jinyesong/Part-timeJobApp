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
    sessionStorage.removeItem("postId");
    location.href = "../index.html";
  });

  $(".homeUserName").html(sessionStorage.getItem("name")); 
// 사이드바 끝

//게시글 내용 출력
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
    var payBoost = doc.data().payboost;

    $("#postTitle").val(title);
    $("#postContent").val(content);
    //$("#postOtherInfo").html("작성자: "+writer+"<br>근무일: "+workStart+" ~ "+workEnd+"<br>모집 마감일: "+postEnd+"<br>근무지역: "+area+"<br>시급: "+pay+"<br>선호성별: "+gender);

    if (gender == "남") {
        $("input:radio[name=userGender][value='남']").attr('checked', true);
    } 
    else if (gender == "여") {
        $("input:radio[name=userGender][value='여']").attr('checked', true);
    }
    else{ //both
        $("input:radio[name=userGender][value='상관없음']").attr('checked', true);
    }
    $("#workStart").val(workStart);
    $("#workEnd").val(workEnd);
    $("#postEnd").val(postEnd);
    $("#pay").val(pay);
    $("#area").val(area);
    if(payBoost == "true"){
        $("input:radio[name=payboost][value='true']").attr('checked', "true");
        var increaseRate = doc.data().increaseRate;
        var deadline = doc.data().deadline;
        $("#increaseRate").val(increaseRate);
        $("#deadline").val(deadline);
    }
    else{
        $("input:radio[name=payboost][value='false']").attr('checked', "false");
    }
});

$("#backToListBtn").click(function(){
  location.href = "../bulletinBoard/jobOfferBoard.html";
});