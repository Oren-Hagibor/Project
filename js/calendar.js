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
	firebase.auth().onAuthStateChanged(function(user) {
		if (!user) {    // No user is signed in.
			window.location.replace("login.html");
		}         
	});
	var database = firebase.database();
	//var user=firebase.auth().currentUser;
	
	document.addEventListener('DOMContentLoaded', function() {
		var initialLocaleCode = 'en';
		var localeSelectorEl = document.getElementById('locale-selector');
		var calendarEl = document.getElementById('calendar');
		
		
		
		var calendar = new FullCalendar.Calendar(calendarEl, {
			plugins: [ 'interaction', 'timeGrid'  ],
			locale: initialLocaleCode,
			
			//set the calender properties
			contentHeight:600,
			slotDuration: '00:05:00',
			defaultTimedEventDuration: '00:15:00',
			forceEventDuration: true,
			minTime:'15:00:00',
			maxTime:'20:00:00',
			allDaySlot:false,
			hiddenDays: [ 5,6 ], // hide Fridays and Saturdays
			
			//remove event on click
			eventClick: function(info) {
				firebase.auth().onAuthStateChanged(function(user) {
					if (user) {    
						if(info.event.groupId==firebase.auth().currentUser.email){
							if(confirm("Remove the meeting?"))
							info.event.remove();
							deleteUserData(user.email,event.start)
						}
						else{
							window.alert("That meeting does not belong to you");
						}
					}         
				});
			}
			
		});//calendar
		
		calendar.render();
		
		// build the locale selector's options
		calendar.getAvailableLocaleCodes().forEach(function(localeCode) {
			var optionEl = document.createElement('option');
			optionEl.value = localeCode;
			optionEl.selected = localeCode == initialLocaleCode;
			optionEl.innerText = localeCode;
			localeSelectorEl.appendChild(optionEl);
		});
		
		// when the selected option changes, dynamically change the calendar option
		localeSelectorEl.addEventListener('change', function() {
			if (this.value) {
				calendar.setOption('locale', this.value);            
			}
		});
		
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
			calendar.addEvent({ title: 'Teacher meeting', start:da,groupId:firebase.auth().currentUser.email});
		});      
	});//addEventListener   
}
function logout(){
	firebase.auth().signOut();
	window.location.replace("login.html");
}
function writeUserData(userEmail,meeting) {
	var name=userEmail.substring(0, userEmail.indexOf("@"));
	// A post entry.
	
	var updates = {};
	updates[name+'/'+meeting.toDateString()+'/'+meeting.toTimeString()]= "meeting";
	
	return firebase.database().ref().update(updates);
}

function deleteUserData(){
	
}
