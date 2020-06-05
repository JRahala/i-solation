


// we can assume user has logged in here


// have to make it an event listener, other wise it will overload the window.onload in the template.js

window.addEventListener("load",function(event) {

	getPosts();

},false);



function getPosts(){

	// for some reason this stuff is not wokring??????
	console.log(User.username);

	sendHTTPRequest('POST', '/get_posts', {'username': 'J'})

	.then(function(posts){
		console.log(posts);
	})
	
	.catch(function(err){
		console.log('User not logged in!');
	});

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



// load relevant user information / post on button click

$('#editModal').on('show.bs.modal', function (event) {

	// button that pressed the modal
  	var button = $(event.relatedTarget);

  	// name of the original post
  	parent = button.parent()

  	console.log(button, parent);

  	postName = parent.find('.postName').text();
  	postContent = parent.find('.postContent').text();

  	var modal = $(this);

  	console.log(postName, postContent);

  	modal.find('#modal-postName').val(postName);
  	modal.find('#modal-postContent').val(postContent);

})