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

	// save + load user json

	/*

	saveGlobal('User', {'username': 'Jasamrit16'});
	User = loadGlobal('User');

	loadUser();

	*/

	sendHTTPRequest('GET', 'https://reqres.in/api/users').then(responseData => {
		console.log(responseData);
	});

}


function Login(){

	// save + load user json

	saveGlobal('User', {'username': 'Jasamrit16'});
	User = loadGlobal('User');

	loadUser();

}