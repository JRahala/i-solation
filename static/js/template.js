/*

onload:

-> get local storage, check for user logged in
-> if user logged in check for new messages
-> load reccommended posts
-> check timetable (implement later)

save-global(key, value) -> save variable to local storage
get-global(key) -> returns global value of key

*/


var User = {};


function saveGlobal(key, value){

	// overwrites data (stores copy, not reference)

	localStorage.setItem(key, JSON.stringify(value));
	return true;

}


function loadGlobal(key){

	var result = JSON.parse(localStorage.getItem(key));
	return result;

}


window.onload = function(){

	// has the user already logged in?

	var User = loadGlobal();
	console.log(`User is logged as ${User}`);

}