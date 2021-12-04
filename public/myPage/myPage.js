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

$(document).ready(function () {
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
      });
});
db.collection('jobOfferPost').get().then((snapshot)=>{
  snapshot.forEach((doc)=>{
    var writer_id = doc.data().writerEmail;
    if(id == writer_id){
      var title = doc.data().title;
      var post = `<div id='${doc.id}' class='object writePost'>제목: ${title}</div>`
      $("#writePostList").append(post);
    } 
  })
});

//게시글 클릭 이벤트
var targetId;
$("#writePostList").click(function(event) {
  console.log("click!!");
  if(event.target.tagName == "DIV"){
    targetId = event.target.id;
  }
  else{
    targetId = event.target.parentElement.id;
  }
  sessionStorage.setItem("postId", targetId);
  location.href = "../showPostPage/showJobOffer.html";
});

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