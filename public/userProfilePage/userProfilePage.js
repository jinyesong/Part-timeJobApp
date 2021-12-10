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
  
  // user 정보 불러오기
  var user_id = sessionStorage.getItem("user");
  db
      .collection('customer')
      .doc(user_id)
      .get()
      .then((doc) => {
          var name = doc
              .data()
              .name;
          var birth = doc
              .data()
              .birth;
          var phoneNumber = doc.data().phoneNumber;
          var gender = doc.data().gender;
          $("#name").text(name);
          $("#birthday").text(birth);
          $("#email").text(user_id);
          $("#phoneNumber").text(phoneNumber);
          $("#gender").text(gender);
          if(doc.data().starScore){
            var arr = doc.data().starScore;
            var starscore = arr[0];
            var starscoreNum = arr[1];
            $("#starscore").text((parseFloat(starscore)/parseFloat(starscoreNum)).toFixed(1));
          $("#starscoreNum").text(starscoreNum);
          }else{
            $("#starscore").text((0.0).toFixed(1));
          $("#starscoreNum").text(0);
          }
          if(doc.data().profile){
            $("#photo").attr("src", doc.data().profile);
          }
          if (doc.data().resume) {
            $("#prev_resume").attr("href", doc.data().resume);
        } else {
            $("#prev_resume").remove();
        }
        if (doc.data().buisinessLicense) {
            $("#prev_businessLicense").attr("href", doc.data().buisinessLicense);
        } else {
            $("#prev_businessLicense").remove();
        }

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