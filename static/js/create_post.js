


// we can assume user has logged in here


// have to make it an event listener, other wise it will overload the window.onload in the template.js

window.addEventListener("load",function(event) {

	getPosts();

},false);



function getPosts(){

	console.log(User.username);

	sendHTTPRequest('POST', '/get_posts', {'username': User.username})

	.then(function(posts){
		console.log(posts);
	})
	
	.catch(function(err){
		console.log('User not logged in!');
	});

}



function createPost(){

	var heading = $('#create-modal-postName').val();
	var content = $('#create-modal-postContent').val();


	sendHTTPRequest('POST', '/create_new_post', {'username': User.username, 'heading': heading, 'content': content})

	.then(function (responseData){

		if (responseData.worked == true){

			var err_msg = document.getElementById('create-modal-error');
			err_msg.classList = 'text-success';
			err_msg.innerText = 'Successfully created post!';	

			addPost(responseData.post);

		}

		else{

			var err_msg = document.getElementById('create-modal-error');
			err_msg.classList = 'text-danger';
			err_msg.innerText = responseData.error;

		}

	})


	.catch(function (err){

		var err_msg = document.getElementById('create-modal-error');
		err_msg.classList = 'text-danger';
		err_msg.innerText = 'Unexpected error occured on server, please try again later';

	});



}



function editPost(){

	const originalHeading = $(window.listElement).find('.postName').text();

	const newHeading = $(window.postNameElement).val();
	const newContent = $(window.postContentElement).val();

	sendHTTPRequest('POST', '/edit_post', {'username': User.username, 'original_heading': originalHeading, 'new_heading': newHeading, 'new_content': newContent})

	.then(function(responseData){

		if (responseData.worked == true){

			$(window.listElement).find('.postName').text(newHeading);
			$(window.listElement).find('.postContent').text(newContent);

			var err_msg = document.getElementById('modal-error');
			err_msg.classList = 'text-success';
			err_msg.innerText = 'Successfully updated post!';			

		}

		else{

			var err_msg = document.getElementById('modal-error');
			err_msg.classList = 'text-danger';
			err_msg.innerText = responseData.error;

		}

	})

	.catch(function (err){

		console.log(err);

	})


}


// add post element to the list
function addPost(post){

	console.log(post.heading, post.content, post.date, post.votes);

	var postList = document.getElementById('postList');

	var listItem = document.createElement('li');


}




// record parent element

function recordElement(el){

	// get parent element
	window.listElement = el.parentNode;
	console.log('recorded element: ', window.listElement);

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

  	postName = parent.find('.postName').text();
  	postContent = parent.find('.postContent').text();

  	var modal = $(this);

  	// get input fields

  	window.postNameElement = modal.find('#modal-postName');
  	window.postContentElement = modal.find('#modal-postContent');

  	window.postNameElement.val(postName);
  	window.postContentElement.val(postContent);

})