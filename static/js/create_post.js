


// we can assume user has logged in here


// have to make it an event listener, other wise it will overload the window.onload in the template.js

window.addEventListener("load",function(event) {

	getPosts();

},false);



function getPosts(){

	alert('getting posts');

}

function createPost(){

	alert('This is where the modal will go');

}


// add post element to the list
function addPost(post){

	var postList = document.getElementById('postList');

	var listItem = document.createElement('li');
	

}


// searching script

// get key up of search bar 
$("#postSearch").on("keyup", function() {

	// check for values (case doesnt matter)
	var value = $(this).val().toLowerCase();
	$("#postList li").filter(function() {

		// toggle visibility
  		$(this).toggle($(this).find('.postName').text().toLowerCase().indexOf(value) > -1);

	});

});