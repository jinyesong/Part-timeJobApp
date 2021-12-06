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
    var area = doc.data().area;
    var pay = doc.data().pay;
    var gender = doc.data().gender;

    $("#postTitle").html(title);
    $("#postContent").html(content);
    $("#postOtherInfo").html("작성자: "+writer+"<br>선호근무일: "+workStart+" ~ "+workEnd+"<br>선호근무지역: "+area+"<br>희망시급: "+pay+"<br>성별: "+gender);

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
    db.collection('jobSearchPost').doc(postId).delete().then(()=>{
      alert("게시글이 삭제되었습니다");
      location.href = "../bulletinBoard/jobSearchBoard.html";
    })
  }
});

$("#modifyBtn").click(function(){
  location.href = "../modifyPostPage/modifyJobSearchPostPage.html";
});

//근로제의 버튼 클릭
document.getElementById("offerBtn").onclick = function(){
  document.getElementById("offerModal").style.display="block";
}

//근로제의 - 작성한 구인 게시글 목록 가져오기
db.collection('jobOfferPost').get().then((snapshot)=>{
  snapshot.forEach((doc)=>{
    var writerEmail = doc.data().writerEmail;
    if(writerEmail == sessionStorage.getItem("email")){
      var title = doc.data().title;

      var Div = document.createElement("div");
      Div.setAttribute("class", "offerPost");
      Div.setAttribute("id", doc.id);
      var Label = document.createElement("label");
      Label.setAttribute("class", "offerPostTitle");
      var Text = document.createTextNode(title);
      Label.appendChild(Text);
      Div.appendChild(Label);
      document.getElementById("offerPostTitleList").appendChild(Div);
    }
  })
});

//근로제의 - 작성한 구인 게시글 목록 클릭 이벤트
//여러개 클릭하면 안됨 -> css를 하나만 색바뀌게 하거나, 여러개 클릭햇을 때 다르게 세션 저장하는 방법 근데 둘다 모르겠음 -> 부모의 자식 클래스 인덱스 알수있으려나?
//그래서 일단 하나만 클릭한다고 가정, 여러개 클릭하면 색 여러개 바뀌는 상태

$("#offerPostTitleList").click(function(event) {
  var offerTargetId;
  if(event.target.tagName == "DIV"){
    offerTargetId = event.target.id;
    event.target.style.background = "gray";
    event.target.style.color = "white";
  }
  else{
    offerTargetId = event.target.parentElement.id;
    event.target.parentElement.style.background = "gray";
    event.target.parentElement.style.color = "white";
  }
  sessionStorage.setItem("offerPostId", offerTargetId);
});

//근로제의 - 게시글을 선택하고 확인 버튼 눌렀을 때
$("#offerOKBtn").click(function() {
  var offerPostId = sessionStorage.getItem("offerPostId");
  var title;
  var writer;
  document.getElementById(offerPostId).style.background = "#fefefe";
  document.getElementById(offerPostId).style.color = "black";
  document.getElementById("offerModal").style.display="none";

  Div = document.createElement("div");
  Div.setAttribute("class", "offerComment");
  Div.setAttribute("id", offerPostId);
  Label = document.createElement("label");
  Label.setAttribute("class", "offerCommentTitle");

  db.collection('jobOfferPost').doc(offerPostId).get().then((doc)=>{ 
    title = doc.data().title;
    writer = doc.data().writerName;
    var Text = document.createTextNode(title + " | " + writer);
    Label.appendChild(Text);
  });

  Div.appendChild(Label);
  document.getElementById("offerCommentContainer").appendChild(Div);

//데이터베이스 저장하기 + 이제 게시글 조회할 때마다 댓글도 같이 띄워지게 해야함

  sessionStorage.removeItem("offerPostId");
});

//근로제의 - 취소버튼 눌렀을 때
$("#offerCancelBtn").click(function() {
  var offerPostId = sessionStorage.getItem("offerPostId");
  if(offerPostId != null){
    document.getElementById(offerPostId).style.background = "#fefefe";
    document.getElementById(offerPostId).style.color = "black";
    sessionStorage.removeItem("offerPostId");
  }
  document.getElementById("offerModal").style.display="none";
});

//근로제의 댓글 눌렀을 때
$("#offerCommentContainer").click(function(event) {
  var commentTargetId;
  if(event.target.tagName == "DIV"){
    commentTargetId = event.target.id;
  }
  else{
    commentTargetId = event.target.parentElement.id;
  }
  sessionStorage.setItem("postId", commentTargetId);
  location.href = "../showPostPage/showJobOffer.html";
});