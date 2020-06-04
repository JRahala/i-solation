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

*/


var User = {};


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


}


window.onload = function(){

	// has the user logged in

	window.User = loadGlobal('User');
	if (User != null){

		// load the user button in the navbar

		loadUser();

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

			loadUser();

		}

	})

	.catch(function(error){

		// display the error message
		msg.innerText = error;

	});

}




function signOut(){

	// clear the User variable
	// reload the webpage

	console.log('signing out');

}


function dismissAlert(element){

	// get parent element
	const parent = element.parentNode;

	// user notification ID to remove notification (from parent element) -> ajax request
	const notification_id = parent.id.split('-')[1];
	
	// send reference to current user and notification id
	sendHTTPRequest('POST', '/delete_notification', {})
	
	.then(function deleteDebug(response){

		// delete element
		parent.remove();
	
	})

	.catch(function err(error){
		
		console.log(error);
	
	});

	

}