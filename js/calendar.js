
var calendar;
function init(){
	initFirebase();
	var data=[];	
	data=createdata();
	var eventSource = {
            id : 1,
			events: data,
			color: 'green'
	}
	setTimeout(function(){
		stringy(data);
	}, 2000);	
	initCalendar(eventSource);
	
	setTimeout(function(){calendar.refetchEvents();}, 3000);
}

//can replace refetch:
//newEvents.forEach(event => calendar.addEvent(event));


//radio listener
$(document).ready(function(){
	$('input[type=radio]').click(function(){
		// alert(this.value);
	});
});


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
function stringy(obj){
	str = JSON.stringify(obj, null, 4); // (Optional) beautiful indented output.
	console.log(str); // Logs output to dev tools console.
}

function createdata(){
	var data=[];
	var i=0;
	var rootRef = firebase.database().ref();
	rootRef.on('value', function(rootSnapshot) {
		rootSnapshot.forEach(function(teacherSnapshot) {
			teacherSnapshot.forEach(function(userSnapshot) {
				//	userSnapshot.forEach(function(timeSnapshot) {
				data.push({
					title:   userSnapshot.val().name,
					start: userSnapshot.val().start,
					//description:
				});				
			})
		});
	//});
	});
	return data;
}


function getTeacherName(){
	var names = document.getElementsByName('optradio');
	for(var i = 0; i < names.length; i++){
		if(names[i].checked){
			return names[i].value;
		}
	}
}


function initCalendar(eventSource){
	document.addEventListener('DOMContentLoaded', function() {		
		var calendarElement = document.getElementById('calendar');	
		calendar = new FullCalendar.Calendar(calendarElement, {			
			//set the calender properties
			plugins: [ 'interaction','timeGrid','bootstrap' ],
			eventSources:eventSource,
			//events:data,
			contentHeight: 600,
			slotDuration: '00:05:00',
			defaultTimedEventDuration: '00:15:00',
			forceEventDuration: true,
			defaultView: 'timeGridDay',
			minTime:'15:00:00',
			maxTime:'20:00:00',
			allDaySlot:false,
			themeSystem:'bootstrap',
			titleFormat:{month:'long',year:'numeric',day:'numeric'},
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
				left: '',
				center: 'title',
				right: 'today prev,next logoutButton'
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

function writeUserData(userEmail,meeting) {
	var name=userEmail.substring(0, userEmail.indexOf("@"));	
	firebase.database().ref(getTeacherName()+'/'+name+' '+meeting.toString()).set({
		name: name,
		start: meeting.toString()
	});
}

function deleteUserData(userEmail,meeting){
	var name=userEmail.substring(0, userEmail.indexOf("@"));	
	var updates = {};
	updates[name+'/'+meeting.toDateString()+'/'+meeting.toTimeString()]= null;	
	return firebase.database().ref().update(updates);
}
