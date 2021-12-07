// var today = new Date();
//           var year = today.getFullYear();
//           var month = ('0' + (today.getMonth() + 1)).slice(-2);
//           var day = ('0' + today.getDate()).slice(-2);

//           var dateString = year + '-' + month  + '-' + day;
//           console.log(dateString);

var firebaseConfig = {
  apiKey: "AIzaSyCqJYyU3LacLWMFjix0SfgZt0Ajsuo5c-Q",
  authDomain: "part-time-job-38ba6.firebaseapp.com",
  projectId: "part-time-job-38ba6",
  storageBucket: "part-time-job-38ba6.appspot.com",
  messagingSenderId: "107342558639",
  appId: "1:107342558639:web:f0e8e5c3845e6ed667eb5a"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();

  db.collection('customer').get().then((snapshot)=>{
    snapshot.forEach((doc)=>{
      console.log(doc.data())
    })
  });
var id = sessionStorage.getItem("email");

  db
      .collection('customer')
      .doc(id)
      .get()
      .then((doc) => {
          console.log(doc.data());
          var name = doc
              .data()
              .name;
          var birth = doc
              .data()
              .birth;
          $("#name").text(name);
          $("#birthday").text(birth);
          $("#email").text(id);
          if(typeof doc.data().profile != "undefined"){
            $("#photo").attr("src", doc.data().profile);
          }
      });

// 작성한 게시글 불러오기
db.collection('jobOfferPost').get().then((snapshot)=>{
  snapshot.forEach((doc)=>{
    var writer_id = doc.data().writerEmail;
    var post_id = doc.id;
    if(id == writer_id){
      var title = doc.data().title;
      var post = `<div id='${doc.id}' class='object writePost jobOfferPost'><b>구인</b> ${title}</div>`
      $("#writePostList").append(post);
      if(doc.data().applicantList){ // 지원자 목록
        for(i in doc.data().applicantList){
          var applicant = doc.data().applicantList[i];
          db.collection('customer').doc(applicant).get().then((doc)=>{
            var applyerpost = `<div>
            <div id='${post_id}' class='object applicant jobOfferPost'><b id='${applicant}'>${doc.data().name}</b> ${title}</div>
            <div id="applicantBtn">
                        <button id="profileBtn" class="Btn">프로필보기</button>
                        <button id="hiringBtn" class="Btn">채용하기</button>
                        <button id="chattingBtn" class="Btn">채팅하기</button>
                        <button id="starScoreBtn" class="Btn">별점평가하기</button>
                    </div>
                    </div>`
          $("#applicantList").append(applyerpost);
          });
        }
        
      }
    } 
  })
});

db.collection('jobSearchPost').get().then((snapshot)=>{
  snapshot.forEach((doc)=>{
    var writer_id = doc.data().writerEmail;
    if(id == writer_id){
      var title = doc.data().title;
      var post = `<div id='${doc.id}' class='object writePost jobSearchPost'><b>구직</b> ${title}</div>`
      $("#writePostList").append(post);
    } 
  })
});

// 지원한 게시글 불러오기
db.collection('jobOfferPost').where("applicantList", "array-contains", id).get().then((snapshot)=>{
  snapshot.forEach((doc)=>{
    var title = doc.data().title;
  var post = `<div id='${doc.id}' class='object applyPost jobOfferPost'><b>구인</b> ${title}</div>`
      $("#applyPostList").append(post);
  });
});

//게시글 클릭 이벤트
var targetId;
$("#writePostList").click(function(event) {
  if(event.target.tagName == "DIV"){
    targetId = event.target.id;
  }
  else{
    targetId = event.target.parentElement.id;
  }
  sessionStorage.setItem("postId", targetId);
  if(event.target.classList.contains("jobOfferPost")){
    location.href = "../showPostPage/showJobOffer.html";
  }
  else if(event.target.classList.contains("jobSearchPost")){
    location.href = "../showPostPage/showJobSearch.html";
  }
});

$("#applyPostList").click(function(event) {
  if(event.target.tagName == "DIV"){
    targetId = event.target.id;
  }
  else{
    targetId = event.target.parentElement.id;
  }
  sessionStorage.setItem("postId", targetId);
  if(event.target.classList.contains("jobOfferPost")){
    location.href = "../showPostPage/showJobOffer.html";
  }
  else if(event.target.classList.contains("jobSearchPost")){
    location.href = "../showPostPage/showJobSearch.html";
  }
});

$("#applicantList").click(function(event) {
  console.log(event.target.tagName, event.target.id);

  if($(event.target).hasClass("applicant")){
    targetId = event.target.id;
    console.log(targetId);
    sessionStorage.setItem("postId", targetId);
    location.href = "../showPostPage/showJobOffer.html";
  }
  else if(event.target.id == "profileBtn"){
    var id = $(event.target).parent().prev().children().first().attr("id");
    sessionStorage.setItem("user", id);
    location.href = "../userProfilePage/userProfilePage.html";
  }
  else if(event.target.id == "starScoreBtn"){
    $("#starScoreModal").css("display","block");
  }
});

/* 별점평가 모달창 */
$("#confirm").on('click', function(){
  $("#starScoreModal").css("display","none");
});
$("#cancel").on('click', function(){
  $("#starScoreModal").css("display","none");
});
/* 별점평가 모달창 끝*/


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

/*사이드바 끝*/
