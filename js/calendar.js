function init(){
		//create config for initialization
         const firebaseConfig = {
				apiKey: "AIzaSyCrxpBSnbxGQ5Htkxsh6BLnyjxhHTvfKdM",
				authDomain: "web-project-12345.firebaseapp.com",
				databaseURL: "https://web-project-12345.firebaseio.com",
				projectId: "web-project-12345",
				storageBucket: "web-project-12345.appspot.com",
				messagingSenderId: "797401562503",
				appId: "1:797401562503:web:3a2c7949233f565a62e722",
				measurementId: "G-B2NCF39XYP"
			};
			
			//Initialize Firebase
			firebase.initializeApp(firebaseConfig);
			
	//firebase.database().ref('/Meetings/').once('value').then(function (snapshot) {
  //      Meetings = snapshot.val();
  //  });
}

function writeUserData(userEmail,date) {
	var name=userEmail.substring(0, userEmail.indexOf("@"));
  // A post entry.
  var postData = {
    "date":date  
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('Meetings').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/Meetings/' + name+newPostKey]= postData;

  return firebase.database().ref().update(updates);
}

function deleteUserData(){
	(userEmail,date)
}
