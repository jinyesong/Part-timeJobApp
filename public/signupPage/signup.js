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
function isName() {
    if ($('#userName').val() == "") {
        alert("이름을 입력해주세요");
        return false;
    }
    return true;
}

function isId() {
    if ($('#userId').val() == "") {
        alert("email을 입력해주세요");
        return false;
    }
    return true;
}

function isPw() {
    if ($('#userPw').val() == "") {
        alert("비밀번호를 입력해주세요.");
        return false;
    }
    return true;
}

function equalPw() {
    if ($('#userPw2').val() == "") {
        alert("비밀번호를 확인해주세요.");
        return false;
    }
    if ($('#userPw').val() != $('#userPw2').val()) {
        alert("비밀번호가 일치하지 않습니다.");
        return false;
    }
    return true;
}

function isBirthday() {
    if ($('#userBirthDay').val() == "") {
        alert("생년월일을 입력해주세요.");
        return false;
    }
    if ($('#userBirthDay').val().length != 6) {
        alert("생년월일을 6글자로 입력해주세요.");
        return false;
    }
    if ($.isNumeric($('#userBirthDay').val()) == false) {
        alert("숫자만 입력해주세요.");
        return false;
    }
    return true;
}

function isPhoneNumber() {
    if ($('#phoneNumber').val() == "") {
        alert("전화번호를 입력해주세요.");
        return false;
    }
    if ($('#phoneNumber').val().length != 11) {
        alert("전화번호를 11글자로 입력해주세요.");
        return false;
    }
    if ($.isNumeric($('#phoneNumber').val()) == false) {
        alert("숫자만 입력해주세요.");
        return false;
    }
    return true;
}

function validateUser() {
    if (isName() && isId() && isPw() && equalPw() && isBirthday() && isPhoneNumber()) {
        return new Promise(function (resolve, reject) {
            resolve("validate user");
        });
    } else {
        return new Promise(function (resolve, reject) {
            reject("exist error in user info");
        });
    }
}

$("#submit").click(function () {
    var resume_url = null;
    var businessLicense_url = null;
    var name = $('#userName').val();
    var id = $('#userId').val();
    var pw = $('#userPw').val();
    var birthday = $('#userBirthDay').val();
    var phoneNumber = $('#phoneNumber').val();
    var gender = $("input[name='userGender']:checked").val();
    var area = $("#area option:selected").val();
    var size = db
        .collection('customer')
        .get()
        .then(snap => {
            var count = 0
            snap.forEach(doc => {
                count += 1;
            });
            return count;
        });
    validateUser()
        .then((res) => {
          console.log(res + " here!");
            const promise = new Promise((resolve, reject) => {
                db
                    .collection('customer')
                    .get()
                    .then((snapshot) => {
                        snapshot.forEach((doc) => {
                            if ($('#userId').val() == doc.data().email) {
                                console.log($('#userId').val());
                                console.log(doc.data().email);
                                alert("해당 email로 가입된 이력이 있습니다.");
                                return reject("exists id");
                            }
                        });
                        return resolve("register posible");
                    });
            });

            promise
                .then(result => {
                    console.log(result);
                    console.log(size);
                    console.log(String(size));

                    if ($('#resume').val()) {
                        var file = $('#resume')[0].files[0];
                        var storageRef = storage.ref();
                        var path = storageRef.child(id + '/resume');
                        var work = path.put(file);
                        work.on('state_changed', null, (error) => {
                            console.error('fail:', error);
                        }, () => {
                            work
                                .snapshot
                                .ref
                                .getDownloadURL()
                                .then((url) => {
                                    console.log('upload path', url);
                                    resume_url = url;
                                });
                        });
                    }
                    if ($('#businessLicense').val()) {
                        var file = $('#businessLicense')[0].files[0];
                        var storageRef = storage.ref();
                        var path = storageRef.child(id + '/businessLicense');
                        var work = path.put(file);
                        work.on('state_changed', null, (error) => {
                            console.error('fail:', error);
                        }, () => {
                            work
                                .snapshot
                                .ref
                                .getDownloadURL()
                                .then((url) => {
                                    console.log('upload path', url);
                                    businessLicense = url;
                                });
                        });
                    }

                })
                .then(function () {
                    var data = {
                        name: name,
                        email: id,
                        pasword: pw,
                        gender: gender,
                        phoneNumber: phoneNumber,
                        area: area,
                        birth: birthday,
                        resume: resume_url,
                        businessLicense: businessLicense_url
                    }
                    console.log("저장 시작!");
                    db
                        .collection('customer')
                        .doc(id)
                        .set(data)
                        .then((result) => {
                            console.log("디비 저장!");
                            window.location.href = "../index.html";
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                })
                .catch(err => {
                  console.log(err);
                });
        })
        .catch(err => {
          console.log(err);
        });
});
