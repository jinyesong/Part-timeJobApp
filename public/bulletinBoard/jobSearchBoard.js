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
    location.href="../postwritingPage/jobSearchwriting.html"
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

  $(".homeUserName").html(sessionStorage.getItem("name"));