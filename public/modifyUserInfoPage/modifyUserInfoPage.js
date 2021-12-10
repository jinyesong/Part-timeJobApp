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

$(document).ready(function () {
    var id = sessionStorage.getItem("email");
    console.log(id);
    db
        .collection('customer')
        .doc(id)
        .get()
        .then((doc) => {
            console.log(doc.data());
            var name = doc
                .data()
                .name;
            var birth = doc
                .data()
                .birth;
            var phoneNumber = doc
                .data()
                .phoneNumber;
            var gender = doc
                .data()
                .gender;
            var area = doc
                .data()
                .area;
            console.log(name, birth, phoneNumber);
            $("#userName").val(name);
            $("#userBirthDay").val(birth);
            $("#phoneNumber").val(phoneNumber);
            $("#area")
                .val(area)
                .prop("selected", true);
            if (gender == "man") {
                $("input:radio[name=userGender][value='man']").attr('checked', true);
            } else if (gender == "woman") {
                $("input:radio[name=userGender][value='woman']").attr('checked', true);
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
            if (doc.data().profile){
              $("#userPhoto").attr("src", doc.data().profile);
            }
        });
});

$("#submit").click(function () {
  var resume_url = null;
  var businessLicense_url = null;
  var name = $('#userName').val();
  var id = sessionStorage.getItem("email");
  var birthday = $('#userBirthDay').val();
  var phoneNumber = $('#phoneNumber').val();
  var gender = $("input[name='userGender']:checked").val();
  var area = $("#area option:selected").val();
  sessionStorage.setItem("name", name);

  var saveinfo_promise = new Promise(function (resolve, reject) {
    var data = {
        name: name,
        gender: gender,
        phoneNumber: phoneNumber,
        area: area,
        birth: birthday
    }
    db
        .collection('customer')
        .doc(id)
        .update(data)
        .then((result) => {
            resolve();
        })
        .catch((err) => {
            reject("Database error");
        });
  });
  saveinfo_promise.then(result => {
    var resume_promise = new Promise((resolve, reject) => {
        if ($('#resume').val()) {
            var file = $('#resume')[0].files[0];
            var storageRef = storage.ref();
            var path = storageRef.child(id + '/resume');
            var work = path.put(file);
            work.on('state_changed', null, (error) => {
                console.error('fail:', error);
            }, () => {
                path
                    .getDownloadURL()
                    .then((url) => {
                        resume_url = url;
                        db
                            .collection('customer')
                            .doc(id)
                            .update({resume: resume_url});
                        resolve();
                    });
            });
        } else {
            resolve();
        }
    });
    var license_promise = new Promise((resolve, reject) => {
        if ($('#businessLicense').val()) {
            var file = $('#businessLicense')[0].files[0];
            var storageRef = storage.ref();
            var path = storageRef.child(id + '/businessLicense');
            var work = path.put(file);
            work.on('state_changed', null, (error) => {
                console.error('fail:', error);
            }, () => {
                path
                    .getDownloadURL()
                    .then((url) => {
                        businessLicense_url = url;
                        db
                            .collection('customer')
                            .doc(id)
                            .update({businessLicense: businessLicense_url});
                        resolve();
                    });
            });
        } else {
            resolve();
        }
    });
    var profile_promise = new Promise((resolve, reject) => {
      if ($('#profile').val()) {
          var file = $('#profile')[0].files[0];
          var storageRef = storage.ref();
          var path = storageRef.child(id + '/profile');
          var work = path.put(file);
          work.on('state_changed', null, (error) => {
              console.error('fail:', error);
          }, () => {
              path
                  .getDownloadURL()
                  .then((url) => {
                      profile_url = url;
                      db
                          .collection('customer')
                          .doc(id)
                          .update({profile: profile_url});
                      resolve();
                  });
          });
      } else {
          resolve();
      }
  });
    Promise
        .all([resume_promise, license_promise, profile_promise])
        .then(function () {
            window.location.href = "./modifyUserinfoPage.html";
        });
});
});

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
});

$(".homeUserName").html(sessionStorage.getItem("name"));

/*사이드바 끝*/

$("#profile").on('change', function () {
    var fileName = $("#profile").val();
    $(".upload-name").val(fileName);
});