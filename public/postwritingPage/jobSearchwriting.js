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
$("#saveBtn").click(function () {
    if (isTitle() && isContent()) {
        var title = $("#titlebox").val();
        var content = $("#contentbox").val();
        var gender = $("input[name='gender']:checked").val();
        var area = $("#area option:selected").val();
        var period = $("#period option:selected").val();
        var area = $("#area option:selected").val();
        var pay = $("#pay").val();
        var writer = sessionStorage.getItem("email");
        var data = {
            title: title,
            content: content,
            gender: gender,
            area: area,
            period: period,
            pay: pay,
            writer: writer
        }
        var promise = new Promise((resolve, reject)=>{
            db
                            .collection('jobSearchPost')
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
            window.location.href="../bulletinBoard/jobSearchBoard.html";
        });
        
    }
});