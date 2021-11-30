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

function isName(){
  if($('#userName').val() == ""){
    alert("이름을 입력해주세요");
    return false;
  }
  return true;
}

function isId(){
  if($('#userId').val()==""){
    alert("email을 입력해주세요");
    return false;
  }else{
    db.collection('customer').get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        if($('#userId').val() == doc.data()['email']){
          alert("해당 email로 가입된 이력이 있습니다.");
          return false;
        }  
      });
    });
  }
  return true;
}

function isPw(){
  if($('#userPw').val() == ""){
    alert("비밀번호를 입력해주세요.");
    return false;
  }
  return true;
}

function equalPw(){
  if($('#userPw2').val() == ""){
    alert("비밀번호를 확인해주세요.");
    return false;
  }
  if($('#userPw').val() != $('#userPw2').val()){
    alert("비밀번호가 일치하지 않습니다.");
    return false;
  }
  return true;
}

function isBirthday(){
  if($('#userBirthDay').val() == ""){
    alert("생년월일을 입력해주세요.");
    return false;
  }
  if($('#userBirthDay').val().length != 6){
    alert("생년월일을 6글자로 입력해주세요.");
    return false;
  }
  if($.isNumeric($('#userBirthDay').val()) == false){
    alert("숫자만 입력해주세요.");
    return false;
  }
  return true;
}

function isPhoneNumber(){
  if($('#phoneNumber').val() == ""){
    alert("전화번호를 입력해주세요.");
    return false;
  }
  if($('#phoneNumber').val().length != 11){
    alert("전화번호를 11글자로 입력해주세요.");
    return false;
  }
  if($.isNumeric($('#phoneNumber').val()) == false){
    alert("숫자만 입력해주세요.");
    return false;
  }
  return true;
}

$("#submit").click(function(){
  if(isName() && isId() && isPw() && equalPw() && isBirthday() && isPhoneNumber()){
    var name = $('#userName').val();
    var id = $('#userId').val();
    var pw = $('#userPw').val();
    var birthday = $('#userBirthDay').val();
    var phoneNumber = $('#phoneNumber').val();
    var gender = $("input[name='userGender']:checked").val();
    var area = $("#area option:selected").val();
    var size;
    db.collection('customer').get().then(snap=>{
      size = Number(snap.doc.length);
    });
    console.log(size);
    console.log(String(size));
    db.collection('customer').doc(String(size)).set({name: name, id: id});
    if($('#resume').val()){
    
    }
    if($('#businessLicense').val()){

    }
  }else{
    return false;
  }
});