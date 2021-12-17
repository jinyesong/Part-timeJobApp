document.getElementById("filter").onclick = function(){
    document.getElementById("modal").style.display="block";
}

document.getElementById("confirm").onclick = function(){
    document.getElementById("modal").style.display="none";
}

document.getElementById("reset").onclick = function(){
    document.getElementsByName("gender")[0].checked=true;
    document.getElementById("area").options[0].selected=true;
    document.getElementById("period").options[0].selected=true;
    document.getElementById("pay").value = "8720";
}

document.getElementById("write").onclick = function(){
    location.href="../postwritingPage/jobSearchwriting.html"
}

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
    
//구인게시글 마감일 지나면 삭제
db
    .collection('jobOfferPost')
    .orderBy('timestamp', 'desc')
    .get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            if (doc.data().worker) {
                return;
            }

            var postEnd = doc
                .data()
                .postEnd;

            var today = new Date();
            var postEndDate = new Date(postEnd +" 23:59:59");
            var postId = doc.id;

            //마감일 지나면 삭제 단, 채용된 게시글은 별점평가 후 삭제
            if((postEndDate.valueOf() < today.valueOf()) && (typeof doc.data().worker == "undefined")){
                db
            .collection('jobOfferPost')
            .doc(postId)
            .delete()
            .then(() => { //jobOffer 목록에서 삭제 후 
                db.collection("jobSearchPost") //jobSearch 댓글 삭제하러감
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {//jobSearchPost 탐색
                var arr = doc.data().offerPostList; 
                if (typeof arr != "undefined") { 
                    arr.splice($.inArray(postId, arr), 1);
                    db
                        .collection('jobSearchPost')
                        .doc(postId)
                        .update({offerPostList: arr})
                        .then(() => {
                            console.log("댓글도 삭제됨");
                    });
                }
            });
            })
            return;
            });
        }
      });
    })
    


  // DB에서 게시판 목록 가져오기 
db.collection('jobSearchPost').
  orderBy('timestamp', 'desc').get().then((snapshot)=>{
  snapshot.forEach((doc)=>{
      var title = doc.data().title;
      var writer = doc.data().writerName;
      var pay = doc.data().pay;
      var post = `<div class='post' id=${doc.id}>
        <label class='postTitle'>${title}</label>
        <label class='postWriter'><b>작성자</b> ${writer}</label>
        <label class='postPay'><b>시급</b> ${pay}원</label>
        </div>`
        $('#postList').append(post);
  })
});


//게시글 클릭 이벤트
var targetId;
$("#postList").click(function(event) {
  if(event.target.tagName == "DIV"){
    targetId = event.target.id;
  }
  else{
    targetId = event.target.parentElement.id;
  }
  sessionStorage.setItem("postId", targetId);
  location.href = "../showPostPage/showJobSearch.html";
});

// 필터링정렬 함수
function sortAndFilter(){
  var gender = $("input:radio[name='gender']:checked").val();
  var area = $("#area option:selected").val();
  var period = $("#period option:selected").val();
  var periodList = {"no": 0 , "day":1, "week":2,"month":3, "monthOver":4}
  var pay = Number($("#pay").val());
  var sort = $("#sort_btn option:selected").val();
  console.log(sort);
  if(sort == "latestOrder"){
    db.collection('jobSearchPost')
    .orderBy('timestamp', 'desc')
    .get().then((snapshot)=>{
      $("#postList").children().remove();
      snapshot.forEach((doc)=>{
        var title = doc.data().title;
        var writer = doc.data().writerName;
        var postPay = doc.data().pay;
        var workStart = doc.data().workStart;
        var workEnd = doc.data().workEnd;
        var workStartArr = workStart.split("-");
        var workEndArr = workEnd.split("-");
        var strDate = new Date(workStartArr[0], workStartArr[1], workStartArr[2]);
        var endDate = new Date(workEndArr[0], workEndArr[1], workEndArr[2]);
        var time = endDate.getTime() -strDate.getTime();
        var day = time/(1000*60*60*24);
        if((periodList[period] == 0) | (periodList[period] == 1 && day <= 1) | (periodList[period] == 2 && day > 1 && day <=7) |
        (periodList[period] == 3 && day > 7 && day <=30) | (periodList[period] == 4 && day > 30)){
          if((area == "No") | area == doc.data().area){
            console.log(postPay);
            if(pay <= postPay){
              if(gender == "no" | gender == doc.data().gender){
                var post = `<div class='post' id=${doc.id}>
        <label class='postTitle'>${title}</label>
        <label class='postWriter'><b>작성자</b> ${writer}</label>
        <label class='postPay'><b>시급</b> ${postPay}원</label>
        </div>`
        $('#postList').append(post);
              }
              
            } 
          }
        }
      });
      
  });
  }
  else if(sort == "payOrder"){
    db.collection('jobSearchPost')
    .orderBy('pay')
    .get().then((snapshot)=>{
      $("#postList").children().remove();
      snapshot.forEach((doc)=>{
        var title = doc.data().title;
        var writer = doc.data().writerName;
        var postPay = doc.data().pay;
        var workStart = doc.data().workStart;
        var workEnd = doc.data().workEnd;
        var workStartArr = workStart.split("-");
        var workEndArr = workEnd.split("-");
        var strDate = new Date(workStartArr[0], workStartArr[1], workStartArr[2]);
        var endDate = new Date(workEndArr[0], workEndArr[1], workEndArr[2]);
        var time = endDate.getTime() -strDate.getTime();
        var day = time/(1000*60*60*24);
        if((periodList[period] == 0) | (periodList[period] == 1 && day <= 1) | (periodList[period] == 2 && day > 1 && day <=7) |
        (periodList[period] == 3 && day > 7 && day <=30) | (periodList[period] == 4 && day > 30)){
          if((area == "No") | area == doc.data().area){
            console.log(postPay);
            if(pay <= postPay){
              if(gender =="no" | gender == doc.data().gender){
                var post = `<div class='post' id=${doc.id}>
        <label class='postTitle'>${title}</label>
        <label class='postWriter'><b>작성자</b> ${writer}</label>
        <label class='postPay'><b>시급</b> ${postPay}원</label>
        </div>`
        $('#postList').append(post);
              }
              
            }     
          }
        }
      });
      
  });
  }
}

$("#confirm").on("click", function(){
  sortAndFilter();
});
$("#sort_btn").on('change', function(){
  sortAndFilter();
});