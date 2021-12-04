document.getElementById("filter").onclick = function(){
    document.getElementById("modal").style.display="block";
}

document.getElementById("confirm").onclick = function(){
    document.getElementById("modal").style.display="none";
}

document.getElementById("reset").onclick = function(){
    document.getElementsByName("gender")[0].checked=true;
    document.getElementById("area").options[0].selected=true;
    document.getElementById("period").options[0].selected=true;
    document.getElementById("pay").value = "최저시급";
}

document.getElementById("write").onclick = function(){
    location.href="../postwritingPage/jobOfferwriting.html"
}

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
  db.collection('jobOfferPost').get().then((snapshot)=>{
    snapshot.forEach((doc)=>{
    //   console.log(doc.data().postEnd)
        var title = doc.data().title;
        var writer = doc.data().writerName;
        var postEnd = doc.data().postEnd;

        var Div = document.createElement("div");
        Div.setAttribute("class", "post");
        Div.setAttribute("id", doc.id);
        var Label = document.createElement("label");
        Label.setAttribute("class", "postTitle");
        var Text = document.createTextNode(title);
        Label.appendChild(Text);
        Div.appendChild(Label);
        var Br = document.createElement("br");
        Div.appendChild(Br);
        Label = document.createElement("label");
        Label.setAttribute("class", "postWriter");
        Text = document.createTextNode(writer);
        Label.appendChild(Text);
        Div.appendChild(Label);
        Br = document.createElement("br");
        Div.appendChild(Br);
        Label = document.createElement("label");
        Label.setAttribute("class", "postEnd");
        Text = document.createTextNode(postEnd);
        Label.appendChild(Text);
        Div.appendChild(Label);
        document.getElementById("postList").appendChild(Div);
    })
  });

//게시글 클릭 이벤트
var targetId;
$("#postList").click(function(event) {
  if(event.target.tagName == "DIV"){
    targetId = event.target.id;
  }
  else{
    targetId = event.target.parentElement.id;
  }
  sessionStorage.setItem("postId", targetId);
  location.href = "../showPostPage/showJobOffer.html";
});
