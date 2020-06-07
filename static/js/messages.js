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

			// fill in the conversations heading
			$('#conversationHeading').text(conversationName);

			// fill in the pending requests

			// fill in the history

		})

		.catch(function (err){
			displayError('Sorry, an error occured!', 'Conversations could not be loaded, please try again later');
		})

	
	}

}


function displayMessage(messageContent, messageAuthor){

	console.log(messageContent, messageAuthor);

	// get the chat container
	//$('#chatContainer').


}