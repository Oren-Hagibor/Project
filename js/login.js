firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    document.getElementById("login_div").style.display = "none";

    var user = firebase.auth().currentUser;

    if(user != null){
      window.location.replace("calendar.html");
    }

  } else {
    // No user is signed in.

    document.getElementById("login_div").style.display = "block";

  }
});

function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);
    // ...
  });
}

function initDataBase() {


    // Initialize Firebase
    firebase.database().ref('/student/').once('value').then(function (snapshot) {
        studentList = snapshot.val();
    });
    firebase.database().ref('/teacher/').once('value').then(function (snapshot) {
        teacherList = snapshot.val();
    });
    firebase.database().ref('/hour/').once('value').then(function (snapshot) {
        startTime = snapshot.val().start;
        endTime = snapshot.val().end;
    });
}