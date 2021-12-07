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
db.collection('jobSearchPost').doc(postId).get().then((doc)=>{
    var title = doc.data().title;
    var content = doc.data().content;
    var workStart = doc.data().workStart;
    var workEnd = doc.data().workEnd;
    var area = doc.data().area;
    var pay = doc.data().pay;
    var gender = doc.data().gender;

    $("#titlebox").val(title);
    $("#contentbox").val(content);

    if (gender == "남") {
        $("input:radio[name=userGender][value='남']").attr('checked', true);
    } 
    else if (gender == "여") {
        $("input:radio[name=userGender][value='여']").attr('checked', true);
    }

    $("#workStart").val(workStart);
    $("#workEnd").val(workEnd);
    $("#pay").val(pay);
    $("#area").val(area);
});

$("#backToListBtn").click(function(){
  location.href = "../bulletinBoard/jobOfferBoard.html";
});