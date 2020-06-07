/*
onload:

-> get local storage, check for user logged in
-> if user logged in check for new messages
-> load reccommended posts
-> check timetable (implement later)

save-global(key, value) -> save variable to local storage
get-global(key) -> returns global value of key


Add in AJAX, promises and timeouts: 

	-> verify posting works
	-> create .then() functions
	-> add animation loop


Notifications, make them dissappear using id lookups

*/

// stop notifications from closing the dropdown -> learn this syntax

$(".notification-close").click(function(event){

  event.stopPropagation();


});


function sendHTTPRequest(method, url, data){

	const promise = new Promise(function(resolve, reject){

		// set request information

		const xhr = new XMLHttpRequest();
		xhr.open(method, url);

		xhr.responseType = 'json';
		xhr.timeout = 3000;

		if (data){
			xhr.setRequestHeader('Content-Type', 'application/json');
		}

		// handlers, on response

		xhr.onload = function(){

			if (xhr.status >= 400){
				reject(xhr.response);
			}

			else{
				resolve(xhr.response);
			}

		}

		xhr.onerror = function (){
			reject('Something went wrong!');
		}

		xhr.ontimeout = function(){
			reject('Server took too long to respond - Please check your internet connection');
		}

		// send request

		xhr.send(JSON.stringify(data));

	});

	return promise;

}

// turn milliseconds into dateString
function milString(milliseconds){

	var t = new Date(parseInt(milliseconds))
	var time_string = t.toDateString();

	return time_string;
}


// display error modal

function displayError(errHeading = 'Something went wrong sorry!', errMsg = 'Please refresh the page and try again'){

	$('#errorModal').find('.modal-title').text(errHeading);
	$('#errorModal').find('.modal-body').text(errMsg);
	$('#errorModal').modal();

}

// check if user is lgged in

function userLoggedIn(){
	return (User.username != null && User.username != false && User.username != 'anonymous');
}

function saveGlobal(key, value){

	// overwrites data (stores copy, not reference)

	localStorage.setItem(key, JSON.stringify(value));
	return true;

}


function loadGlobal(key){

	var result = JSON.parse(localStorage.getItem(key));
	return result;

}


function loadUser(){

	// remove the login and sign up options from navbar
	var user_buttons = document.getElementsByClassName('user-button');

	// invert current user-button displays
	for (var element of user_buttons){

		if (element.style.display == 'none'){
			element.style.display = '';
		}

		else{
			element.style.display = 'none';
		}
	}

	// for all class where [classname, key] replace objects with User.key
	var search_attributes = [['user-username', 'username']]

	for (var search of search_attributes){

		var search_elements = document.getElementsByClassName(search[0]);

		for (var i = 0; i < search_elements.length; i++){
			search_elements[i].innerHTML = User[search[1]];
		}

	}

	// load notifications

	sendHTTPRequest('POST', '/get_notifications', {'username': User.username})

	.then(function (responseData){

		if (responseData.worked == true){

			for (var notification in responseData.notifications){

				displayNotification(responseData.notifications[notification], notification);
			
			}

		}

		else{
			
			// display error message
			console.log('Notifications cannot be displayed right now!')

		}

	})

	.catch(function(err){

		console.log('NOTIFICATION ERROR!');
		console.log(err);

	})


}


window.onload = function(){

	// has the user logged in & not signed out

	window.User = loadGlobal('User');
	window.signedOut = loadGlobal('signedOut');

	if (User != null & (window.signedOut == false || window.signedOut == null)){

		// load the user button in the navbar
		loadUser();

	}

	if (User == null){

		User = {};
		
	}

}


function signUp(){

	// get input data

	const username = document.getElementById('sign-up-username').value;
	const password = document.getElementById('sign-up-password').value;
	const valid_pswd = document.getElementById('sign-up-valid-password').value;


	var msg = document.getElementById('sign-up-error-message');
	
	// check passwords are the same

	if (valid_pswd != password){

		msg.innerText = 'Passwords do not match!';
		return false
	
	}  

	sendHTTPRequest('POST', '/sign_up', {'username': username, 'password': password})

	.then(function(responseData){

		// response msg

		msg.innerText = responseData.response;

		if (responseData.worked == true){

			// update + load user

			User.username = username;
			User.password = password;

			// change signedOut setting
			saveGlobal('signedOut', false);
			saveGlobal('User', User);
			loadUser();

		}

	})

	.catch(function(error){

		// display the error message
		msg.innerText = error;

	});

}


function Login(){

	// get input data

	const username = document.getElementById('login-username').value;
	const password = document.getElementById('login-password').value;

	var msg = document.getElementById('login-error-message');

	console.log(username, password);


	sendHTTPRequest('POST', '/login', {'username': username, 'password': password})

	.then(function(responseData){

		// response msg

		msg.innerText = responseData.response;

		if (responseData.worked == true){

			// update + load user

			User.username = username;
			User.password = password;

			console.log(User);
			console.log(username, password);

			// change sign out setting
			saveGlobal('User', User);
			saveGlobal('signedOut', false);

			loadUser();

		}

	})

	.catch(function(error){

		// display the error message
		msg.innerText = error;

	});

}


function signOut(){

	// clear the User variable (not global)
	saveGlobal('signedOut', true);
	saveGlobal('User', {})

	// reload the webpage (with signedOut settings) -> wont loadUser()
	// this is acting weird - I will revisit it later
	location = location;

}


// update the notifications badge

function dismissAlert(element){

	// get parent element
	const parent = element.parentNode;

	// user notification ID to remove notification (from parent element) -> ajax request
	const notification_id = parent.id.split('-')[1];
	
	// send reference to current user and notification id
	sendHTTPRequest('POST', '/delete_notification', {'notification_id': notification_id, 'username': User.username})
	
	.then(function deleteElement(response){

		// delete element
		parent.remove();
	
	})

	.catch(function err(error){
		
		console.log(error);
	
	});
	
}


function displayNotification(notification, time){

	var notification_list = document.getElementById('notification-list');

	var card_body = document.createElement('div');

	card_body.classList = ('card-body list-group-item');
	card_body.id = 'notification-' + time;

	var button = document.createElement('button');

	button.classList = 'close notification-close';
	
	button.onclick = function(event){
		dismissAlert(this);
		event.stopPropagation();
	};

	button.innerHTML = '&times;';

	var title = document.createElement('h5');
	title.classList = 'card-title';
	title.innerHTML = notification[0];

	var subtitle = document.createElement('h6');
	subtitle.classList = 'card-subtitle mb-2 text-muted';
	subtitle.innerHTML = notification[1];

	var timeLog = document.createElement('p');
	timeLog.classList = 'card-text';

	// format time
	var t = new Date(parseInt(time))
	var time_string = t.toDateString();
	timeLog.innerHTML = time_string;


	card_body.appendChild(button);
	card_body.appendChild(title);
	card_body.appendChild(subtitle);
	card_body.appendChild(timeLog);

	notification_list.appendChild(card_body);

}

// socket programming

// listen for notifications
// update the badge

var socket = io.connect('/');

/*

function send_msg(){

	data = {'user': 'yeet'};
    socket.emit('chat', data);

}
*/

socket.on('new_notification', function(data){

	displayNotification(data['notification'], data['time']);

});




