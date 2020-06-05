


// we can assume user has logged in here


// have to make it an event listener, other wise it will overload the window.onload in the template.js

window.addEventListener("load",function(event) {

	getPosts();

},false);



function getPosts(){

	// for some reason this stuff is not wokring??????
	console.log(User.username);

	sendHTTPRequest('POST', '/get_posts', {'username': User.username})

	.then(function(posts){
		console.log(posts);
	})
	
	.catch(function(err){
		console.log('User not logged in!');
	});

}

/*

function createPost(post_name, post_content){

	// I dont know how this part will work - send the request
	sendHTTPRequest('POST', '/create_new_post', {'post_name': post_name, 'post_content': post_content})

	.then(function (post){

		if (post_worked == false){
			// return error
			var err_msg = document.getElementById();
		}

		else{

		}

	})

	.catch(function (err){
		conosole.log(err);
	});


}

*/


// add post element to the list
function addPost(post){

	var postList = document.getElementById('postList');

	var listItem = document.createElement('li');


}



// edit a post given the original username
// post ['new_heading'], ['new_content']

function editPost(){


	sendHTTPRequest('POST', '/edit_post', {'username': User.username, 
		'original_heading': window.currentPostName,
		'new_heading': window.currentPostPosition.find('.postName').text(),
		'new_content': window.currentPostPosition.find('.postContent').text()})

	.then(function (responseData){
		if (responseData.worked == true){
			// update selected element

			alert('changing the new_heading: ', responseData.new_heading);
			alert('changing the new_content: ', responseData.new_content);

		  	window.listElement.find('.postName').text(responseData.new_heading);
		  	window.listElement.find('.postContent').text(responseData.new_content);

		}

		else{
			// add toast alert
			var err_msg = document.getElementById('modal-error');
			err_msg.innerText = responseData.error;
		}
	})

	.catch(function (err){
		console.log(err);
	});


}


// record parent element

function recordElement(element){

	// get parent element
	console.log(element);
	window.listElement = element.parentElement;

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

  	window.currentPostName = postName;
  	window.currentPostPosition = parent;

  	var modal = $(this);

  	console.log(postName, postContent);

  	modal.find('#modal-postName').val(postName);
  	modal.find('#modal-postContent').val(postContent);

})