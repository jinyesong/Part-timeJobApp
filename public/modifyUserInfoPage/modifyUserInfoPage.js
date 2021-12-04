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
  db.collection('customer').get().then((snapshot)=>{
    snapshot.forEach((doc)=>{
      console.log(doc.data())
    })
  });

$(document).ready(function(){
  var id = sessionStorage.getItem("email");
  db.collection('customer').doc(id).get().then((doc)=>{
    console.log(doc.data().data());
    var name = doc.data().name;
    var birth = doc.data().birth;
    var phoneNumber = doc.data().phoneNumber;
    var gender = doc.data().gender;
    console.log(name, birth, phoneNumber);
    $("#userName").val(name);
    $("#userBirthday").val(birth);
    $("#phoneNumber").val(phoneNumber);
    if(getnder == "man"){
      $("input:radio[name=userGender][value='man']").attr('checked', true);
    }
    else if(gender == "woman"){
      $("input:radio[name=userGender][value='woman']").attr('checked', true);
    }
    });
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

$("#file").on('change',function(){
    var fileName = $("#file").val();
    $(".upload-name").val(fileName);
  });