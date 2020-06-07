window.addEventListener("load",function(event) {

	// if the user is not logged in display the error message
	if (userLoggedIn() == true){


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

	console.log(conversationName);

}