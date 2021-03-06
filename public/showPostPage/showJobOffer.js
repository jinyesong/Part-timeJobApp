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
    sessionStorage.removeItem("postId");
    sessionStorage.removeItem("user");
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
db
    .collection('jobOfferPost')
    .doc(postId)
    .get()
    .then((doc) => {
        var title = doc
            .data()
            .title;
        var content = doc
            .data()
            .content;
        var writer = doc
            .data()
            .writerName;
        var workStart = doc
            .data()
            .workStart;
        var workEnd = doc
            .data()
            .workEnd;
        var postEnd = doc
            .data()
            .postEnd;
        var area = doc
            .data()
            .area;
        var pay = doc
            .data()
            .pay;
        var gender = doc
            .data()
            .gender;
        var payBoost = doc
            .data()
            .payboost;

        $("#postTitle").html(title);
        $("#postContent").html(content);
        $("#postOtherInfo").html(
            "작성자: " + writer + "<br>근무일: " + workStart + " ~ " + workEnd + "<br>모집 마감일: " +
            postEnd + "<br>근무지: " + area + "<br>시급: " + pay +"원"+ "<br>선호성별: " + gender
        );

        //마감전 시급인상 띄우기
        var payboost = doc.data().payboost;
        var increaseRate = doc.data().increaseRate;
        var deadline = doc.data().deadline;

        if(payboost == "true"){
          var today = new Date();
          var postEndDate = new Date(postEnd+" 23:59:59");
          var boostStartDate = new Date(new Date(postEnd+" 23:59:59").setDate(postEndDate.getDate() - deadline));
          if((boostStartDate.valueOf() < today.valueOf()) || (boostStartDate.valueOf() === today.valueOf())){
            var dDay = postEndDate.getDate()-today.getDate();
            if(dDay<0){
                $("#payboostInfo").html("[모집마감]<br>인상시급: " +  (pay+(pay*(0.01*increaseRate)))+"원");
            }
            else{
                $("#payboostInfo").html("모집마감 D-"+ dDay + "<br>인상시급: " +  (pay+(pay*(0.01*increaseRate)))+"원");
            }
            $("#payboostInfo").css("font-weight", "bold");
          }
        }

        if (writer == sessionStorage.getItem("name")) {
            $("#modifyBtn").attr("disabled", false);
            $("#removeBtn").attr("disabled", false);
            $("#modifyBtn").css("color", "white");
            $("#removeBtn").css("color", "white");
            $("#applyBtn").attr("disabled", true);
            $("#applyBtn").css("background-color", "gray");
        } else {
            // 이미 지원한 게시글일 경우
            if (doc.data().applicantList) {
                if (doc.data().applicantList.includes(sessionStorage.getItem("email"))) {
                    $("#applyBtn").attr("id", "applyCancelBtn");
                    $("#applyCancelBtn").text("지원 취소");
                }
            } else {
                $("#applyBtn").attr("disabled", false);
                $("#applyBtn").css("background-color", "red");
            }
            $("#modifyBtn").attr("disabled", true);
            $("#removeBtn").attr("disabled", true);
            $("#modifyBtn").css("color", "gray");
            $("#removeBtn").css("color", "gray");
        }

        if (payBoost = true) {
            var increaseRate = doc
                .data()
                .increaseRate;
            var deadline = doc
                .data()
                .deadline;
        }
    });

$("#backToListBtn").click(function () {
    location.href = "../bulletinBoard/jobOfferBoard.html";
});

$("#removeBtn").click(function () {
    var deleteConfirm = confirm("게시글을 삭제하시겠습니까?");
    if (deleteConfirm == true) {
        db
            .collection('jobOfferPost')
            .doc(postId)
            .delete()
            .then(() => {
                alert("게시글이 삭제되었습니다");
                location.href = "../bulletinBoard/jobOfferBoard.html";
            })
    }
});

$("#modifyBtn").click(function () {
    location.href = "../modifyPostPage/modifyJobOfferPostPage.html";
});

$(document).ready(function () {
    // 지원 취소 버튼 클릭
    $(document).on('click', "#applyCancelBtn", function () {
        console.log("cancel btn");
        if (confirm("지원을 취소하시겠습니까?") == true) {
            db
                .collection('jobOfferPost')
                .doc(postId)
                .get()
                .then((doc) => {
                    const arr = doc
                        .data()
                        .applicantList;
                    arr.splice($.inArray(sessionStorage.getItem("email"), arr), 1);
                    db
                        .collection('jobOfferPost')
                        .doc(postId)
                        .update({applicantList: arr})
                        .then((result) => {
                            alert("지원이 취소되었습니다");
                            location.href = "./showJobOffer.html";
                        });
                });

        } else {
            return false;
        }
    });

    $(document).on('click', "#applyBtn", function(){
        console.log('apply')
        if (confirm("지원하시겠습니까?") == true) {
            db
                .collection('jobOfferPost')
                .doc(postId)
                .get()
                .then((doc) => {
                    if (typeof doc.data().applicantList == "undefined") {
                        db
                            .collection('jobOfferPost')
                            .doc(postId)
                            .update({
                                applicantList: [sessionStorage.getItem("email")]
                            })
                            .then((result) => {
                                
                                alert("지원되었습니다");
                                location.href = "./showJobOffer.html";
                            });
                    } else {
                        const arr = doc
                            .data()
                            .applicantList;
                        arr.push(sessionStorage.getItem("email"));
                        db
                            .collection('jobOfferPost')
                            .doc(postId)
                            .update({applicantList: arr})
                            .then((result) => {
                                alert("지원되었습니다");
                                location.href = "./showJobOffer.html";
                            });
                    }
                });

        } else {
            return false;
        }
    });

});

//지도 팝업 창 띄우기
$("#mapBtn").click(function(){
    document.getElementById("mapModal").style.display="block";
    db
    .collection('jobOfferPost')
    .doc(postId)
    .get()
    .then((doc) => {
        var area = doc
            .data()
            .area;
    geocoder.addressSearch(area, function(result, status) {

        // 정상적으로 검색이 완료됐으면 
         if (status === kakao.maps.services.Status.OK) {
    
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
    
            // 결과값으로 받은 위치를 마커로 표시합니다
            var marker = new kakao.maps.Marker({
                map: map,
                position: coords
            });
    
            // 마커에 클릭이벤트를 등록합니다
            kakao.maps.event.addListener(marker, 'click', function() {
            var infowindow = new kakao.maps.InfoWindow();
            // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
            infowindow.setContent('<div style="width:150px;text-align:center;padding:6px 0;">'+area+'</div>');
            infowindow.open(map, marker);
        });
            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
            map.setCenter(coords);
        }
    });    
    map.relayout();
});
});

$("#mapCloseBtn").click(function(){
    document.getElementById("mapModal").style.display="none";
});

//지도
var container = document.getElementById('map');
	var options = {
		center: new kakao.maps.LatLng(33.450701, 126.570667),
		level: 3
	};

var map = new kakao.maps.Map(container, options);

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();
