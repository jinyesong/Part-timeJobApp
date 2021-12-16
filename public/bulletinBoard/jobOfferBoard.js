document
    .getElementById("filter")
    .onclick = function () {
        document
            .getElementById("modal")
            .style
            .display = "block";
    }

document
    .getElementById("confirm")
    .onclick = function () {
        document
            .getElementById("modal")
            .style
            .display = "none";
    }

document
    .getElementById("reset")
    .onclick = function () {
        document
            .getElementsByName("gender")[0]
            .checked = true;
        document
            .getElementById("area")
            .options[0]
            .selected = true;
        document
            .getElementById("period")
            .options[0]
            .selected = true;
        document
            .getElementById("pay")
            .value = "8720";
    }

document
    .getElementById("write")
    .onclick = function () {
        location.href = "../postwritingPage/jobOfferwriting.html"
    }

/* 사이드바 */
function openSlideMenu() {
    document
        .getElementById('menu')
        .style
        .width = '260px';
    document
        .getElementById('page')
        .style
        .marginRight = '260px';
}
function closeSlideMenu() {
    document
        .getElementById('menu')
        .style
        .width = '0';
    document
        .getElementById('page')
        .style
        .marginRight = '0';
}

$("#logoutBtn").click(function () {
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("email");
    location.href = "../index.html";
    sessionStorage.removeItem("postId");
});

// 사이드바 끝

$(".homeUserName").html(sessionStorage.getItem("name")); //~님

// DB에서 게시판 목록 가져오기
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

db
    .collection('jobOfferPost')
    .orderBy('timestamp', 'desc')
    .get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            if (doc.data().worker) {
                return;
            }
            var title = doc
                .data()
                .title;
            var writer = doc
                .data()
                .writerName;
            var postEnd = doc
                .data()
                .postEnd;
            var pay = doc
                .data()
                .pay;

            var today = new Date();
            var postEndDate = new Date(postEnd +" 23:59:59");

            //마감일 지나면 삭제 단, 채용된 게시글은 별점평가 후 삭제
            if((postEndDate.valueOf() < today.valueOf()) && (typeof doc.data().worker == "undefined")){
                db
            .collection('jobOfferPost')
            .doc(doc.id)
            .delete()
            .then(() => {
                console.log("마감일 지난 게시글 삭제");
            })
            return;
            }

            //마감전 시급인상 적용시 div테두리 바뀜 + 시급 인상되어 표시
            var payboost = doc
                .data()
                .payboost;
            var increaseRate = doc
                .data()
                .increaseRate;
            var deadline = doc
                .data()
                .deadline;
            var postEnd = doc
                .data()
                .postEnd;

            var boostStartDate = new Date(
                postEndDate.setDate(postEndDate.getDate() - deadline)
            );
            var payboosted = false;
            if (payboost == "true" && (boostStartDate < today) || (boostStartDate == today)) {
                payboosted = true;
                pay = pay + pay * (0.01 * increaseRate);
            }

            var post = `<div class='post' id=${doc.id}>
        <label class='postTitle'>${title}</label>
        <label class='postWriter'><b>작성자</b> ${writer}</label>
        <label class='postPay'><b>시급</b> ${pay}원</label>
        <label class='postEnd'><b>마감일</b> ${postEnd}</label>
        </div>`
                $('#postList')
                .append(post);

            if (payboosted) {
                document
                    .getElementById(doc.id)
                    .style
                    .border = "2px solid red";
            }
        })
    });

//게시글 클릭 이벤트
var targetId;
$("#postList").click(function (event) {
    if (event.target.tagName == "DIV") {
        targetId = event.target.id;
    } else if (event.target.tagName == "LABEL") {
        targetId = event.target.parentElement.id;
    } else if (event.target.tagName == "B") {
        targetId = event.target.parentElement.parentElement.id;

    }
    sessionStorage.setItem("postId", targetId);
    location.href = "../showPostPage/showJobOffer.html";
});

// 필터링정렬 함수
function sortAndFilter() {
    var gender = $("input:radio[name='gender']:checked").val();
    var area = $("#area option:selected").val();
    var period = $("#period option:selected").val();
    var periodList = {
        "no": 0,
        "day": 1,
        "week": 2,
        "month": 3,
        "monthOver": 4
    }
    var pay = Number($("#pay").val());
    var sort = $("#sort_btn option:selected").val();
    console.log(sort);
    console.log("필터pay", typeof pay);
    console.log("값", pay);
    if (sort == "latestOrder") {
        db
            .collection('jobOfferPost')
            .orderBy('timestamp', 'desc')
            .get()
            .then((snapshot) => {
                $("#postList")
                    .children()
                    .remove();
                snapshot.forEach((doc) => {
                    if (doc.data().worker) {
                        return;
                    }
                    var title = doc
                        .data()
                        .title;
                    var writer = doc
                        .data()
                        .writerName;
                    var postEnd = doc
                        .data()
                        .postEnd;
                    var postPay = doc
                        .data()
                        .pay;
                    var workStart = doc
                        .data()
                        .workStart;
                    var workEnd = doc
                        .data()
                        .workEnd;
                    var workStartArr = workStart.split("-");
                    var workEndArr = workEnd.split("-");
                    var strDate = new Date(workStartArr[0], workStartArr[1], workStartArr[2]);
                    var endDate = new Date(workEndArr[0], workEndArr[1], workEndArr[2]);
                    var postendDate = new Date(postEnd+" 23:59:59");
                    var presentDate = new Date();
                    var time = endDate.getTime() - strDate.getTime();
                    var day = time / (1000 * 60 * 60 * 24);
                    if ((periodList[period] == 0) | (periodList[period] == 1 && day <= 1) | (periodList[period] == 2 && day > 1 && day <= 7) | (periodList[period] == 3 && day > 7 && day <= 30) | (periodList[period] == 4 && day > 30)) {
                        if ((area == "No") | doc.data().area.includes(area)) {
                            console.log(postPay);
                            if (pay <= postPay) {
                                if (gender == "no" | gender == doc.data().gender) {
                                    if (postendDate.valueOf >= presentDate.valueOf) {
                                        var today = new Date();
                                        var postEndDate = new Date(postEnd +" 23:59:59");
                                        //마감전 시급인상 적용시 div테두리 바뀜 + 시급 인상되어 표시
            var payboost = doc
            .data()
            .payboost;
        var increaseRate = doc
            .data()
            .increaseRate;
        var deadline = doc
            .data()
            .deadline;
        var postEnd = doc
            .data()
            .postEnd;

        var boostStartDate = new Date(
            postEndDate.setDate(postEndDate.getDate() - deadline)
        );
        var payboosted = false;
        if (payboost == "true" && (boostStartDate < today) || (boostStartDate == today)) {
            payboosted = true;
            pay = pay + pay * (0.01 * increaseRate);
        }

        var post = `<div class='post' id=${doc.id}>
    <label class='postTitle'>${title}</label>
    <label class='postWriter'><b>작성자</b> ${writer}</label>
    <label class='postPay'><b>시급</b> ${pay}원</label>
    <label class='postEnd'><b>마감일</b> ${postEnd}</label>
    </div>`
            $('#postList')
            .append(post);

        if (payboosted) {
            document
                .getElementById(doc.id)
                .style
                .border = "2px solid red";
        }
                                    }

                                }
                            }
                        }
                    }

                });

            });
    } else if (sort == "dueDayOrder") {
        db
            .collection('jobOfferPost')
            .orderBy('postEnd')
            .get()
            .then((snapshot) => {
                $("#postList")
                    .children()
                    .remove();
                snapshot.forEach((doc) => {
                    if (doc.data().worker) {
                        return;
                    }
                    var title = doc
                        .data()
                        .title;
                    var writer = doc
                        .data()
                        .writerName;
                    var postEnd = doc
                        .data()
                        .postEnd;
                    var postPay = doc
                        .data()
                        .pay;
                    var workStart = doc
                        .data()
                        .workStart;
                    var workEnd = doc
                        .data()
                        .workEnd;
                    var workStartArr = workStart.split("-");
                    var workEndArr = workEnd.split("-");
                    var strDate = new Date(workStartArr[0], workStartArr[1], workStartArr[2]);
                    var endDate = new Date(workEndArr[0], workEndArr[1], workEndArr[2]);
                    var postendDate = new Date(postEnd+" 23:59:59");
                    var presentDate = new Date();
                    var time = endDate.getTime() - strDate.getTime();
                    var day = time / (1000 * 60 * 60 * 24);
                    if ((periodList[period] == 0) | (periodList[period] == 1 && day <= 1) | (periodList[period] == 2 && day > 1 && day <= 7) | (periodList[period] == 3 && day > 7 && day <= 30) | (periodList[period] == 4 && day > 30)) {
                        if ((area == "No") | doc.data().area.includes(area)) {
                            console.log(postPay);
                            if (pay <= postPay) {
                                if (gender == "no" | gender == doc.data().gender) {
                                    if (postendDate.valueOf >= presentDate.valueOf) {
                                        var today = new Date();
                                        var postEndDate = new Date(postEnd +" 23:59:59");
                                        //마감전 시급인상 적용시 div테두리 바뀜 + 시급 인상되어 표시
            var payboost = doc
            .data()
            .payboost;
        var increaseRate = doc
            .data()
            .increaseRate;
        var deadline = doc
            .data()
            .deadline;
        var postEnd = doc
            .data()
            .postEnd;

        var boostStartDate = new Date(
            postEndDate.setDate(postEndDate.getDate() - deadline)
        );
        var payboosted = false;
        if (payboost == "true" && (boostStartDate < today) || (boostStartDate == today)) {
            payboosted = true;
            pay = pay + pay * (0.01 * increaseRate);
        }

        var post = `<div class='post' id=${doc.id}>
    <label class='postTitle'>${title}</label>
    <label class='postWriter'><b>작성자</b> ${writer}</label>
    <label class='postPay'><b>시급</b> ${pay}원</label>
    <label class='postEnd'><b>마감일</b> ${postEnd}</label>
    </div>`
            $('#postList')
            .append(post);

        if (payboosted) {
            document
                .getElementById(doc.id)
                .style
                .border = "2px solid red";
        }pend(post);
                                        
                                    }
                                }
                            }
                        }
                    }
                });

            });
    } else if (sort == "payOrder") {
        db
            .collection('jobOfferPost')
            .orderBy('pay', 'desc')
            .get()
            .then((snapshot) => {
                $("#postList")
                    .children()
                    .remove();
                snapshot.forEach((doc) => {
                    if (doc.data().worker) {
                        return;
                    }
                    var title = doc
                        .data()
                        .title;
                    var writer = doc
                        .data()
                        .writerName;
                    var postEnd = doc
                        .data()
                        .postEnd;
                    var postPay = doc
                        .data()
                        .pay;
                    var workStart = doc
                        .data()
                        .workStart;
                    var workEnd = doc
                        .data()
                        .workEnd;
                    var workStartArr = workStart.split("-");
                    var workEndArr = workEnd.split("-");
                    var strDate = new Date(workStartArr[0], workStartArr[1], workStartArr[2]);
                    var endDate = new Date(workEndArr[0], workEndArr[1], workEndArr[2]);
                    var time = endDate.getTime() - strDate.getTime();
                    var postendDate = new Date(postEnd+" 23:59:59");
                    var presentDate = new Date();
                    var day = time / (1000 * 60 * 60 * 24);
                    if ((periodList[period] == 0) | (periodList[period] == 1 && day <= 1) | (periodList[period] == 2 && day > 1 && day <= 7) | (periodList[period] == 3 && day > 7 && day <= 30) | (periodList[period] == 4 && day > 30)) {
                        if ((area == "No") | doc.data().area.includes(area)) {
                            console.log(postPay);
                            if (pay <= postPay) {
                                if (gender == "no" | gender == doc.data().gender) {
                                    if (postendDate.valueOf >= presentDate.valueOf) {
                                        var today = new Date();
                                        var postEndDate = new Date(postEnd +" 23:59:59");
                                        //마감전 시급인상 적용시 div테두리 바뀜 + 시급 인상되어 표시
var payboost = doc
.data()
.payboost;
var increaseRate = doc
.data()
.increaseRate;
var deadline = doc
.data()
.deadline;
var postEnd = doc
.data()
.postEnd;

var boostStartDate = new Date(
postEndDate.setDate(postEndDate.getDate() - deadline)
);
var payboosted = false;
if (payboost == "true" && (boostStartDate < today) || (boostStartDate == today)) {
payboosted = true;
pay = pay + pay * (0.01 * increaseRate);
}

var post = `<div class='post' id=${doc.id}>
<label class='postTitle'>${title}</label>
<label class='postWriter'><b>작성자</b> ${writer}</label>
<label class='postPay'><b>시급</b> ${pay}원</label>
<label class='postEnd'><b>마감일</b> ${postEnd}</label>
</div>`
$('#postList')
.append(post);

if (payboosted) {
document
    .getElementById(doc.id)
    .style
    .border = "2px solid red";
}
                                    }
                                }
                            }
                        }
                    }
                });

            });
    }
}

$("#confirm").on("click", function () {
    sortAndFilter();
});
$("#sort_btn").on('change', function () {
    sortAndFilter();
});