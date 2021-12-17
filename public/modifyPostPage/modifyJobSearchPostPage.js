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

var today = new Date();
today.setDate(today.getDate()+1);
var todayDate = today.toISOString().substring(0, 10);
$("#workStart").attr('min', todayDate);
$("#workStart").change(function(){
  $("#workEnd").val("");
  $("#postEnd").val("");
  $("#postEnd").attr("disabled", true);
    $("#workEnd").attr("disabled", false);
    var workstart = new Date($("#workStart").val());
    $("#workEnd").attr('min', workstart.toISOString().substring(0, 10));
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
$("#saveBtn").click(function () {
  if (isTitle() && isContent() && isWorkStart() && isWorkEnd()) {
      var title = $("#titlebox").val();
      var content = $("#contentbox").val();
      var gender = $("input[name='userGender']:checked").val();
      var area = $("#area option:selected").val();
      var pay = Number($("#pay").val());
      var workEnd = $("#workEnd").val();
      var workStart = $("#workStart").val();
      var writerEmail = sessionStorage.getItem("email");
      var writerName = sessionStorage.getItem("name");
      var data = {
          title: title,
          content: content,
          gender: gender,
          area: area,
          pay: pay,
          workStart: workStart,
          workEnd: workEnd,
          writerEmail: writerEmail,
          writerName: writerName,
      }
      var promise = new Promise((resolve, reject)=>{
          db
                          .collection('jobSearchPost')
                          .doc(sessionStorage.getItem("postId"))
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
          window.location.href="../showPostPage/showJobSearch.html";
      });
      
  }
});