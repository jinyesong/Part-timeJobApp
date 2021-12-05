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
      
db.collection('jobOfferPost').get().then((snapshot)=>{
  snapshot.forEach((doc)=>{
    var writer_id = doc.data().writerEmail;
    if(id == writer_id){
      var title = doc.data().title;
      var post = `<div id='${doc.id}' class='object writePost jobOfferPost'><b>구인</b> ${title}</div>`
      $("#writePostList").append(post);
      if(doc.data().applicantList){
        for(i in doc.data().applicantList){
          var applicant = doc.data().applicantList[i];
          var applyerpost = `<div id='${doc.id}' class='object applicant jobOfferPost'><b>${applicant}</b> ${title}</div>`
          $("#writePostList").append(applyerpost);
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