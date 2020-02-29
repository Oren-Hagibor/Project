var eventArray=[];
var dataArray=[];

function init(){
	initFirebase();
	createDataArray();
	createEventArray();
	initCalendar();
}

function initFirebase(){
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
	
	//Check if user is already signed in
	firebase.auth().onAuthStateChanged(function(user) {
		if (!user) {    // No user is signed in.
			window.location.replace("login.html");
		}         
	});	
	
}


function createDataArray(){
	var rootRef = firebase.database().ref();
	rootRef.on('value', function(rootSnapshot) {
		rootSnapshot.forEach(function(dateSnapshot) {
			dateSnapshot.forEach(function(timeSnapshot) {
				dataArray.push(timeSnapshot.val());
			})
		});
	});
}

function createEventArray(){
	for (let i = 0; i < dataArray.length-1; i+=2) {
		eventArray.push({
			title: dataArray[0],
			start: dataArray[1]
		})
	}
	console.log(eventArray.length);
}

function initCalendar(){
	console.log(eventArray.length);
	document.addEventListener('DOMContentLoaded', function() {		
		var calendarElement = document.getElementById('calendar');	
		console.log(eventArray.length);
		var calendar = new FullCalendar.Calendar(calendarElement, {
			
			//set the calender properties
			plugins: [ 'interaction', 'timeGrid','bootstrap'  ],
			eventSources:eventArray,
			contentHeight: 600,
			slotDuration: '00:05:00',
			defaultTimedEventDuration: '00:15:00',
			forceEventDuration: true,
			minTime:'15:00:00',
			maxTime:'20:00:00',
			allDaySlot:false,
			themeSystem:'bootstrap',
			hiddenDays: [ 5,6 ], // hide Fridays and Saturdays
			customButtons: {
				logoutButton: {
					text: 'Logout',
					click: function logout() {
						firebase.auth().signOut();
						window.location.replace("login.html");
					}
				}
			},
			header: {
				left: 'logoutButton',
				center: 'title',
				right: 'today prev,next'
			},
			
			//remove event on click
			eventClick: function(info) {
				firebase.auth().onAuthStateChanged(function(user) {
					if (user) {    
						if(info.event.groupId==firebase.auth().currentUser.email){
							if(confirm("Remove the meeting?"))
							info.event.remove();
							deleteUserData(user.email,new Date(info.event.start));
						}
						else{
							window.alert("That meeting does not belong to you");
						}
					}         
				});
			}			
		});//calendar		
		calendar.render();
		
		//add event on click
		calendar.on('dateClick', function(clickedOn) {
			let da=new Date(clickedOn.dateStr);
			da.setMinutes(da.getMinutes()- da.getMinutes()%15);
			for(event of  calendar.getEvents()){ 
				if(da.getTime()==event.start.getTime())
				{ 
					return;
				}
			} 
			writeUserData(firebase.auth().currentUser.email,da); 
			calendar.addEvent({ title: firebase.auth().currentUser.email, start:da,groupId:firebase.auth().currentUser.email});
		});      
	});//addEventListener   
}

function logout(){
	firebase.auth().signOut();
	window.location.replace("login.html");
}

function writeUserData(userEmail,meeting) {
	var name=userEmail.substring(0, userEmail.indexOf("@"));	
	firebase.database().ref(name+' '+meeting.toString()).set({
		title: name,
		start: meeting.toString()
	});
	
}

function deleteUserData(userEmail,meeting){
	var name=userEmail.substring(0, userEmail.indexOf("@"));	
	var updates = {};
	updates[name+'/'+meeting.toDateString()+'/'+meeting.toTimeString()]= null;	
	return firebase.database().ref().update(updates);
}
