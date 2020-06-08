// load the client socket object

// Establish socket connection
var socket = io.connect("http://localhost:4000");

// Trigger 'join' event
function joinRoom() {
    // Join room
    socket.emit('join', {'username': User.username, 'room': $('#conversationHeading').text()});
}

// Trigger 'leave' event if user was previously on a room
function leaveRoom() {
    socket.emit('leave', {'username': User.username, 'room': $('#conversationHeading').text()});
}

// Trigger this event when a new room needs to be created
function newRoom() {
    socket.emit('new_room', {'username': User.username, 'room': $('#conversationHeading').text()});
}

// display messages on recieval
socket.on('chat', function(data){
    displayMessage(data.msg, data.author, data.time);
});


window.addEventListener("load",function(event) {

	// if the user is not logged in display the error message
	if (userLoggedIn() == true){

		// load all the conversations the user in  is from the /get_conversations method
		sendHTTPRequest('POST', '/get_conversations', {'username': User.username})

		// display post for each post
		.then(function (responseData){

			var allConversations = responseData.allConversations;

			for (var i = 0; i < allConversations.length; i++) {
				displayGroup(allConversations[i]);
			}

		})

		.catch(function(err){
			displayError('Sorry, an error occured!', 'Conversations could not be loaded, please try again later');
		})

	}

	else{


	}


},false);


function newConversation(){

	// display the not logged in message
	if (userLoggedIn() == false){

		$('#notLogged').modal();

	}
	
	// send http request to the /start_conversation handler
	else{

		// get newgroupName
		var conversationName = $('#newGroupName').val();

		sendHTTPRequest('POST', '/start_conversation', {'username': User.username, 'conversationName': conversationName})

		.then(function(responseData){

			if (responseData.worked == true){
				// confirm it worked with new group added at the top of the list
				displayGroup(responseData.conversationName);

				// create new socket io chat room
				newRoom();

			}

			else{
				// display error modal
				displayError('Sorry, an error occured!', responseData.error);
			}
		})

		.catch(function(err){
			// display error modal
			displayError();
		})
	}

}

function displayGroup(conversationName){

	// get the parent of the list of chat elements -> #conversationList
	$('#conversationList').prepend(`<button class="list-group-item list-group-item-action" onclick = 'displayConversation("${conversationName}")'>${conversationName}</button>`);

}


function displayConversation(conversationName){

	if (userLoggedIn() == false){
		displayError('Sorry, an error occured!', 'Conversations could not be loaded, please try again later');
	}

	else{

		// get conversation object, from name
		sendHTTPRequest('POST', '/get_conversation_by_name', {'username': User.username, 'conversationName': conversationName})

		.then(function (responseData){

			// clear the prvious conversation
			$('#chatContainer').html('');

			// fill in the conversations heading
			$('#conversationHeading').text(conversationName);

			// fill in the pending requests

			console.log(responseData.conversation);

			// fill in the history - up to 20 posts back
			for (var i = Math.min(responseData.conversation.history.length, 20); i > 0; i--){
				msg = responseData.consversation.history[responseData.conversation.history.length - i - 1];
				displayMessage(msg[1], msg[0], msg[2]);
			}

		})

		//.catch(function (err){
		//	displayError('Sorry, an error occured!', 'Conversations could not be loaded, please try again later');
		//})

	
	}

}


function displayMessage(messageContent, messageAuthor, messageTime){

	// get the chat container
	// create the messageObject
	if (messageAuthor == User.username){
		$('#chatContainer').append(`

			<div class="card text-white bg-secondary text-right mb-3" style="max-width: 100%;">
			  <div class="card-body">
			    <h6 class="card-title">${messageContent}</h6>
			    <p class="card-text small">${messageAuthor} | ${milString(messageTime)}</p>
			  </div>
			</div>`
			);
	}

	else{
		$('#chatContainer').append(`

			<div class="card text-white bg-primary mb-3" style="max-width: 100%;">
			  <div class="card-body">
			    <h6 class="card-title">${messageContent}</h6>
			    <p class="card-text small">${messageAuthor} | ${milString(messageTime)}</p>
			  </div>
			</div>`
			);
	}

}


function postMessage(){

	// get input values
	msgContent = $('#msgContentInput').val();

	console.log($('#conversationHeading').text());

	// socket send msg
	socket.emit('chat', {'username': User.username, 'room': $('#conversationHeading').text(), 'content': msgContent});


}