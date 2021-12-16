/* 사이드바 */
function openSlideMenu() {
  document.getElementById("menu").style.width = "260px";
  document.getElementById("page").style.marginRight = "260px";
}
function closeSlideMenu() {
  document.getElementById("menu").style.width = "0";
  document.getElementById("page").style.marginRight = "0";
}

$("#logoutBtn").click(function () {
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
  appId: "1:107342558639:web:f0e8e5c3845e6ed667eb5a",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
db.collection("jobSearchPost")
  .doc(postId)
  .get()
  .then((doc) => {
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
    $("#postOtherInfo").html(
      "작성자: " +
        writer +
        "<br>선호근무일: " +
        workStart +
        " ~ " +
        workEnd +
        "<br>선호근무지역: " +
        area +
        "<br>희망시급: " +
        pay +
        "원<br>성별: " +
        gender
    );

    if (writer == sessionStorage.getItem("name")) {
      $("#modifyBtn").attr("disabled", false);
      $("#removeBtn").attr("disabled", false);
      $("#modifyBtn").css("color", "white");
      $("#removeBtn").css("color", "white");
      $("#offerBtn").attr("disabled", true);
      $("#offerBtn").css("background-color", "gray");
    } else {
      $("#offerBtn").attr("disabled", false);
      $("#offerBtn").css("background-color", "red");
      $("#modifyBtn").attr("disabled", true);
      $("#removeBtn").attr("disabled", true);
      $("#modifyBtn").css("color", "gray");
      $("#removeBtn").css("color", "gray");
    }
  });

//댓글 출력
db.collection("jobSearchPost")
  .doc(postId)
  .get()
  .then((doc) => {
    var arr = doc.data().offerPostList;
    if (typeof arr != "undefined") {
      for (var i = 0; i < arr.length; i++) {
        db.collection("jobOfferPost")
          .doc(arr[i])
          .get()
          .then((doc) => {
            var offerPostId = doc.id;
            var title = doc.data().title;
            var writer = doc.data().writerName;
            var writerEmail = doc.data().writerEmail;
            db.collection("customer")
              .doc(writerEmail)
              .get()
              .then((doc) => {
                var commentDiv;
                if (typeof doc.data().profile == "undefined") {
                  commentDiv = `<div id="${offerPostId}" class="offerComment">
            <img src="../Icons/Sample_User_Icon.png" id=${doc.id} class="offerProfile">
            <div class="offerCommentWord">
            <label class="offerCommentTitle">${title}</label> 
            <label class="offerCommentApplicant"><b>근로제의자</b> ${writer}</label>
            </div>
            </div>`;
                } else {
                  commentDiv = `<div id="${offerPostId}" class="offerComment">
            <img src=${doc.data().profile} id=${doc.id} class="offerProfile">
            <div class="offerCommentWord">
            <label class="offerCommentTitle">${title}</label> 
            <label class="offerCommentApplicant"><b>근로제의자</b> ${writer}</label>
            </div>
            </div>`;
                }
                $("#offerCommentContainer").append(commentDiv);
              });
          });
      }
    }
  });

$("#backToListBtn").click(function () {
  location.href = "../bulletinBoard/jobSearchBoard.html";
});

$("#removeBtn").click(function () {
  var deleteConfirm = confirm("게시글을 삭제하시겠습니까?");
  if (deleteConfirm == true) {
    db.collection("jobSearchPost")
      .doc(postId)
      .delete()
      .then(() => {
        alert("게시글이 삭제되었습니다");
        location.href = "../bulletinBoard/jobSearchBoard.html";
      });
  }
});

$("#modifyBtn").click(function () {
  location.href = "../modifyPostPage/modifyJobSearchPostPage.html";
});

//근로제의 버튼 클릭
document.getElementById("offerBtn").onclick = function () {
  document.getElementById("offerModal").style.display = "block";
};

//근로제의 - 작성한 구인 게시글 목록 가져오기
db.collection("jobOfferPost")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      var writerEmail = doc.data().writerEmail;
      if (writerEmail == sessionStorage.getItem("email")) {
        var title = doc.data().title;
        var offerPost = `<div class='offerPost'><input type='radio' name='offerPost' id='${doc.id}'><label class='offerPostTitle' for='${doc.id}'>${title}</label></div>`;
        $("#offerPostTitleList").append(offerPost);
      }
    });
  });

//선택한 게시글 배경색 바뀌게 하고싶다 근데 못하겠음 눈물 굉굉

//근로제의 - 게시글을 선택하고 확인 버튼 눌렀을 때
$("#offerOKBtn").click(function () {
  var offerPostId = $("input[name=offerPost]:checked").attr("id");
  db.collection("jobSearchPost")
    .doc(postId)
    .get()
    .then((doc) => {
      var arr = doc.data().offerPostList;
      if (typeof arr != "undefined") {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] == offerPostId) {
            alert("이미 근로제의한 게시글입니다.");
            return false; //이거 왜 안먹히지
          }
        }
      }
    });

  document.getElementById("offerModal").style.display = "none";

  Div = document.createElement("div");
  Div.setAttribute("class", "offerComment");
  Div.setAttribute("id", offerPostId);
  Label = document.createElement("label");
  Label.setAttribute("class", "offerCommentTitle");

  db.collection("jobOfferPost")
    .doc(offerPostId)
    .get()
    .then((doc) => {
      var offerPostId = doc.id;
      var title = doc.data().title;
      var writer = doc.data().writerName;
      var writerEmail = doc.data().writerEmail;
      db.collection("customer")
        .doc(writerEmail)
        .get()
        .then((doc) => {
          var commentDiv;
          if (typeof doc.data().profile == "undefined") {
            commentDiv = `<div id="${offerPostId}" class="offerComment">
        <img src="../Icons/Sample_User_Icon.png" id=${doc.id} class="offerProfile">
        <div class="offerCommentWord">
        <label class="offerCommentTitle">${title}</label> 
        <label class="offerCommentApplicant"><b>근로제의자</b> ${writer}</label>
        </div>
        </div>`;
          } else {
            commentDiv = `<div id="${offerPostId}" class="offerComment">
        <img src=${doc.data().profile} id=${doc.id} class="offerProfile">
        <div class="offerCommentWord">
        <label class="offerCommentTitle">${title}</label> 
        <label class="offerCommentApplicant"><b>근로제의자</b> ${writer}</label>
        </div>
        </div>`;
          }
          $("#offerCommentContainer").append(commentDiv);
        });
    });

  //데이터베이스 저장하기 + 이제 게시글 조회할 때마다 댓글도 같이 띄워지게 해야함
  db.collection("jobSearchPost")
    .doc(postId)
    .get()
    .then((doc) => {
      if (typeof doc.data().offerPostList == "undefined") {
        var arr = [offerPostId];
        db.collection("jobSearchPost")
          .doc(postId)
          .update({ offerPostList: arr })
          .then((result) => {
            document.getElementById("offerCommentContainer").appendChild(Div);
          });
      } else {
        var arr = doc.data().offerPostList;
        arr.push(offerPostId);
        db.collection("jobSearchPost")
          .doc(postId)
          .update({ offerPostList: arr })
          .then((result) => {
            document.getElementById("offerCommentContainer").appendChild(Div);
          });
      }
    });
});

//근로제의 - 취소버튼 눌렀을 때
$("#offerCancelBtn").click(function () {
  var offerPostId = sessionStorage.getItem("offerPostId");
  if (offerPostId != null) {
    document.getElementById(offerPostId).style.background = "#fefefe";
    document.getElementById(offerPostId).style.color = "black";
    sessionStorage.removeItem("offerPostId");
  }
  document.getElementById("offerModal").style.display = "none";
});

//근로제의 댓글 눌렀을 때
$("#offerCommentContainer").click(function (event) {
  if (event.target.tagName == "IMG") {
    sessionStorage.setItem("user", event.target.id);
    location.href = "../userProfilePage/userProfilePage.html";
  } else {
    sessionStorage.setItem("postId", event.target.parentElement.parentElement.id);
    location.href = "../showPostPage/showJobOffer.html";
  }
});
