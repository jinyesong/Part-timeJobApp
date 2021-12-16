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

    $("#titlebox").val(title);
    $("#contentbox").val(content);
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
    $("#address_kakao").val(area);

    if(payBoost == "true"){
        $("input:radio[name=payboost][value='true']").attr('checked', "true");
        $("#increaseRate").attr("disabled", false);
        $("#deadline").attr("disabled", false);
        var increaseRate = doc.data().increaseRate;
        var deadline = doc.data().deadline;
        $("#increaseRate").val(increaseRate);
        $("#deadline").val(deadline);
    }
    else{
        $("input:radio[name=payboost][value='false']").attr('checked', "false");
        $("#increaseRate").attr("disabled", true);
          $("#deadline").attr("disabled", true);
    }
});

function isTitle() {
  if ($("#titlebox").val()) {
      return true;
  } else {
      alert("제목을 입력해주세요");
      return false;
  }
}
function isContent() {
  if ($("#contentbox").val()) {
      return true;
  } else {
      alert("본문을 입력해주세요");
      return false;
  }
}
function isWorkStart(){
  if($("#workStart").val()){
      return true;
  }
  else{
      alert("근무 시작일을 선택하세요");
      return false;
  }
}
function isWorkEnd(){
  if($("#workEnd").val()){
      return true;
  }
  else{
      alert("근무 마감일을 선택하세요");
      return false;
  }
}
function isPostEnd(){
  if($("#postEnd").val()){
      return true;
  }
  else{
      alert("게시 마감일을 선택하세요");
      return false;
  }
}
function isIncreaseRate(){
  if($("#increaseRate").val() == ""){
      alert("인상율을 입력하세요");
      return false;
  }
  else{
      if($.isNumeric($("#increaseRate").val())){
          return true;
      }
      else{
          alert("숫자만 입력하세요");
          return false;
      }
  }
}
function isDeadline(){
  if($("#deadline").val() == ""){
      alert("디데이를 입력하세요");
      return false;
  }
  else{
      if($.isNumeric($("#deadline").val())){
          return true;
      }
      else{
          alert("숫자만 입력하세요");
          return false;
      }
  }
}
$("#saveBtn").click(function() {
  if (isTitle() && isContent() && isWorkStart() && isWorkEnd() && isPostEnd()) {
      var title = $("#titlebox").val();
      var content = $("#contentbox").val();
      var gender = $("input[name='userGender']:checked").val();
      var area = $("#address_kakao").val();
      var pay = Number($("#pay").val());
      var workEnd = $("#workEnd").val();
      var workStart = $("#workStart").val();
      var postEnd = $("#postEnd").val();
      var payboost = $(".payboost:checked").val();
      var writerEmail = sessionStorage.getItem("email");
      var writerName = sessionStorage.getItem("name");
      if(payboost == "false"){
          var data = {
              title: title,
              content: content,
              gender: gender,
              area: area,
              pay: pay,
              workStart: workStart,
              workEnd: workEnd,
              postEnd: postEnd,
              payboost: payboost,
              writerEmail: writerEmail,
              writerName: writerName,
          }
          var promise = new Promise((resolve, reject)=>{
              db
                              .collection('jobOfferPost')
                              .doc(postId)
                              .update(data)
                              .then((result) => {
                                  console.log("디비 저장!");
                                      resolve()
                              })
                              .catch((err) => {
                                  console.log("저장 실패" + err);
                                      reject()
                              });
          });
          promise.then(function(){
              window.location.href="../showPostPage/showJobOffer.html";
          });
      }
      else if(payboost == "true"){
          if(isDeadline() && isIncreaseRate()){
              var increaseRate = $("#increaseRate").val();
              var deadline = $("#deadline").val();
              var data = {
                  title: title,
                  content: content,
                  gender: gender,
                  area: area,
                  pay: pay,
                  workStart: workStart,
                  workEnd: workEnd,
                  postEnd: postEnd,
                  payboost: payboost,
                  writerEmail: writerEmail,
                  writerName: writerName,
                  increaseRate: increaseRate,
                  deadline: deadline,
              }
              var promise = new Promise((resolve, reject)=>{
                  db
                                  .collection('jobOfferPost')
                                  .doc(postId)
                                  .update(data)
                                  .then((result) => {
                                      console.log("디비 저장!");
                                          resolve()
                                  })
                                  .catch((err) => {
                                      console.log("저장 실패" + err);
                                          reject()
                                  });
              });
              promise.then(function(){
                window.location.href="../showPostPage/showJobOffer.html";
              });
          }
          
      }
      
      
  }
});


$(".payboost").on('click',function(){
  var payboost = $(".payboost:checked").val();
      if(payboost == "true"){
          $("#increaseRate").attr("disabled", false);
          $("#deadline").attr("disabled", false);
      }
      else if(payboost == "false"){
          $("#increaseRate").attr("disabled", true);
          $("#deadline").attr("disabled", true);
      }
});

//카카오 주소 API
window.onload = function(){
    document.getElementById("address_kakao").addEventListener("click", function(){ //주소입력칸을 클릭하면
        //카카오 지도 발생
        new daum.Postcode({
            oncomplete: function(data) { //선택시 입력값 세팅
                document.getElementById("address_kakao").value = data.address; // 주소 넣기
            }
        }).open();
    });
  }