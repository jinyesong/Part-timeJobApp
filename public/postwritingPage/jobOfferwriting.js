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

db
    .collection('customer')
    .get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc);
        })
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
        var gender = $("input[name='gender']:checked").val();
        var area = $("#area option:selected").val();
        var pay = $("#pay").val();
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
                writerName: writerName
            }
            var promise = new Promise((resolve, reject)=>{
                db
                                .collection('jobOfferPost')
                                .add(data)
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
                window.location.href="../bulletinBoard/jobOfferBoard.html";
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
                    deadline: deadline
                }
                var promise = new Promise((resolve, reject)=>{
                    db
                                    .collection('jobOfferPost')
                                    .add(data)
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
                    window.location.href="../bulletinBoard/jobOfferBoard.html";
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


