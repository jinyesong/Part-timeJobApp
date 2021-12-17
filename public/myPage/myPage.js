var firebaseConfig = {
  apiKey: "AIzaSyCqJYyU3LacLWMFjix0SfgZt0Ajsuo5c-Q",
  authDomain: "part-time-job-38ba6.firebaseapp.com",
  projectId: "part-time-job-38ba6",
  storageBucket: "part-time-job-38ba6.appspot.com",
  messagingSenderId: "107342558639",
  appId: "1:107342558639:web:f0e8e5c3845e6ed667eb5a",
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();

var id = sessionStorage.getItem("email");

db.collection("customer")
  .doc(id)
  .get()
  .then((doc) => {
    console.log(doc.data());
    var name = doc.data().name;
    var birth = doc.data().birth;
    $("#name").text(name);
    $("#birthday").text(birth);
    $("#email").text(id);
    if (typeof doc.data().profile != "undefined") {
      $("#photo").attr("src", doc.data().profile);
    }
  });

//구인게시글 마감일 지나면 삭제
db.collection("jobOfferPost")
  .orderBy("timestamp", "desc")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      if (doc.data().worker) {
        return;
      }

      var postEnd = doc.data().postEnd;

      var today = new Date();
      var postEndDate = new Date(postEnd + " 23:59:59");
      var postId = doc.id;

      //마감일 지나면 삭제 단, 채용된 게시글은 별점평가 후 삭제
      if (
        postEndDate.valueOf() < today.valueOf() &&
        typeof doc.data().worker == "undefined"
      ) {
        db.collection("jobOfferPost")
          .doc(postId)
          .delete()
          .then(() => {
            //jobOffer 목록에서 삭제 후
            db.collection("jobSearchPost") //jobSearch 댓글 삭제하러감
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  //jobSearchPost 탐색
                  var arr = doc.data().offerPostList;
                  if (typeof arr != "undefined") {
                    arr.splice($.inArray(postId, arr), 1);
                    db.collection("jobSearchPost")
                      .doc(postId)
                      .update({ offerPostList: arr })
                      .then(() => {
                        console.log("댓글도 삭제됨");
                      });
                  }
                });
              });
            return;
          });
      }
    });
  });

// 작성한 게시글 불러오기
db.collection("jobOfferPost")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      var writer_id = doc.data().writerEmail;
      var post_id = doc.id;
      var workEnd = doc.data().workEnd;
      var end = new Date(workEnd);
      var present = new Date();
      if (id == writer_id) {
        var title = doc.data().title;
        var post = `<div id='${doc.id}' class='object writePost jobOfferPost'><b>구인</b> ${title}</div>`;
        $("#writePostList").append(post);
        if (doc.data().applicantList) {
          // 지원자 목록
          if (doc.data().worker) {
            db.collection("customer")
              .doc(doc.data().worker)
              .get()
              .then((doc) => {
                if (end.valueOf() < present.valueOf()) {
                  var applyerpost = `<div>
          <div id='${post_id}' class='object applicant jobOfferPost' style="margin-bottom:0px;"><b id='${
                    doc.data().email
                  }'>${doc.data().name}</b> ${title}</div>
          <div id="applicantBtn">
                      <button id="profileBtn" class="Btn">프로필보기</button>
                      <button id="hiringCancelBtn" class="Btn">채용취소</button>
                      <button id="chattingBtn" class="Btn">채팅하기</button>
                      <button id="starScoreBtn" class="Btn">별점평가하기</button>
                  </div>
                  </div>`;
                  $("#applicantList").append(applyerpost);
                } else {
                  var applyerpost = `<div>
          <div id='${post_id}' class='object applicant jobOfferPost' style="margin-bottom:0px;"><b id='${
                    doc.data().email
                  }'>${doc.data().name}</b> ${title}</div>
          <div id="applicantBtn">
                      <button id="profileBtn" class="Btn">프로필보기</button>
                      <button id="hiringCancelBtn" class="Btn">채용취소</button>
                      <button id="chattingBtn" class="Btn">채팅하기</button>
                      <button id="starScoreBtn" class="Btn" disabled>별점평가하기</button>
                  </div>
                  </div>`;
                  $("#applicantList").append(applyerpost);
                }
              });
          } else {
            for (i in doc.data().applicantList) {
              var applicant = doc.data().applicantList[i];
              db.collection("customer")
                .doc(applicant)
                .get()
                .then((doc) => {
                  var applyerpost = `<div>
              <div id='${post_id}' class='object applicant jobOfferPost' style="margin-bottom:0px;"><b id='${applicant}'>${
                    doc.data().name
                  }</b> ${title}</div>
              <div id="applicantBtn">
                          <button id="profileBtn" class="Btn">프로필보기</button>
                          <button id="hiringBtn" class="Btn">채용하기</button>
                          <button id="chattingBtn" class="Btn">채팅하기</button>
                          <button id="starScoreBtn" class="Btn" disabled>별점평가하기</button>
                      </div>
                      </div>`;
                  $("#applicantList").append(applyerpost);
                });
            }
          }
        }
      }
    });
  });

db.collection("jobSearchPost")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      var writer_id = doc.data().writerEmail;
      if (id == writer_id) {
        var title = doc.data().title;
        var post = `<div id='${doc.id}' class='object writePost jobSearchPost'><b>구직</b> ${title}</div>`;
        $("#writePostList").append(post);
      }
    });
  });

// 지원한 게시글 불러오기
db.collection("jobOfferPost")
  .where("applicantList", "array-contains", id)
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      var title = doc.data().title;
      var post = `<div id='${doc.id}' class='object applyPost jobOfferPost'><b>구인</b> ${title}</div>`;
      $("#applyPostList").append(post);

      if (
        typeof doc.data().worker != "undefined" &&
        doc.data().worker == sessionStorage.getItem("email")
      ) {
        $(`#${doc.id}`).prepend("<b class='confirmTag'>채용</b>");
      }
    });
  });

//게시글 클릭 이벤트
var targetId;
$("#writePostList").click(function (event) {
  if (event.target.tagName == "DIV") {
    targetId = event.target.id;
  } else {
    targetId = event.target.parentElement.id;
  }
  sessionStorage.setItem("postId", targetId);
  if (event.target.classList.contains("jobOfferPost")) {
    location.href = "../showPostPage/showJobOffer.html";
  } else if (event.target.classList.contains("jobSearchPost")) {
    location.href = "../showPostPage/showJobSearch.html";
  }
});

$("#applyPostList").click(function (event) {
  if (event.target.tagName == "DIV") {
    targetId = event.target.id;
  } else {
    targetId = event.target.parentElement.id;
  }
  sessionStorage.setItem("postId", targetId);
  if (event.target.classList.contains("jobOfferPost")) {
    location.href = "../showPostPage/showJobOffer.html";
  } else if (event.target.classList.contains("jobSearchPost")) {
    location.href = "../showPostPage/showJobSearch.html";
  }
});

$("#applicantList").click(function (event) {
  console.log(event.target.tagName, event.target.id);

  if ($(event.target).hasClass("applicant")) {
    targetId = event.target.id;
    console.log(targetId);
    sessionStorage.setItem("postId", targetId);
    location.href = "../showPostPage/showJobOffer.html";
  } else if (event.target.id == "profileBtn") {
    var id = $(event.target).parent().prev().children().first().attr("id");
    sessionStorage.setItem("user", id);
    location.href = "../userProfilePage/userProfilePage.html";
  } else if (event.target.id == "starScoreBtn") {
    var id = $(event.target).parent().prev().children().first().attr("id");
    var postId = $(event.target).parent().prev().attr("id");
    console.log(id, postId);
    sessionStorage.setItem("user", id);
    sessionStorage.setItem("postId", postId);
    $("#starScoreModal").css("display", "block");
  } else if (event.target.id == "hiringBtn") {
    var workerid = $(event.target)
      .parent()
      .prev()
      .children()
      .first()
      .attr("id");
    var postId = $(event.target).parent().prev().attr("id");
    if (confirm("채용을 확정하시겠습니까?") == true) {
      $("#hiringBtn").attr("id", "hiringCancelBtn");
      $("#hiringCancelBtn").text("채용취소");
      db.collection("jobOfferPost")
        .doc(postId)
        .update({ worker: workerid })
        .then((result) => {
          alert("채용되었습니다");
          location.href = "myPage.html";
        });
    } else {
      return false;
    }
  } else if (event.target.id == "hiringCancelBtn") {
    var workerid = $(event.target)
      .parent()
      .prev()
      .children()
      .first()
      .attr("id");
    var postId = $(event.target).parent().prev().attr("id");
    $("#hiringBtn").attr("id", "hiringCancelBtn");
    if (confirm("채용을 취소하시겠습니까?") == true) {
      $("#hiringCancelBtn").attr("id", "hiringBtn");
      $("#hiringBtn").text("채용확정");
      db.collection("jobOfferPost")
        .doc(postId)
        .update({
          worker: firebase.firestore.FieldValue.delete(),
        })
        .then(() => {
          alert("채용이 취소되었습니다");
          location.href = "myPage.html";
        });
    } else {
      return false;
    }
  }
});

/* 별점평가 모달창 */
$("#confirm").on("click", function () {
  $("#starScoreModal").css("display", "none");
  var star = Number($("input[name='rating']:checked").val());
  var worker = sessionStorage.getItem("user");
  var postId = sessionStorage.getItem("postId");
  console.log(worker, postId);
  console.log(star);
  db.collection("customer")
    .doc(worker)
    .get()
    .then((doc) => {
      console.log(doc.data().email);
      if (typeof doc.data().starScore == "undefined") {
        const arr = [star];
        db.collection("customer")
          .doc(worker)
          .update({ starScore: arr })
          .then((result) => {
            db.collection("jobOfferPost")
              .doc(postId)
              .delete()
              .then(() => {
                alert("별점평가되었습니다.");
                location.href = "./myPage.html";
              });
          });
      } else {
        const arr = doc.data().starScore;
        arr.push(star);
        db.collection("customer")
          .doc(worker)
          .update({ starScore: arr })
          .then((result) => {
            db.collection("jobOfferPost")
              .doc(postId)
              .delete()
              .then(() => {
                alert("별점평가되었습니다.");
                location.href = "./myPage.html";
              });
          });
      }
    });
});
$("#cancel").on("click", function () {
  $("#starScoreModal").css("display", "none");
});
/* 별점평가 모달창 끝*/

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
});

$(".homeUserName").html(sessionStorage.getItem("name"));

/*사이드바 끝*/
