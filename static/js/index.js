
function get_recommended_post(){

	// get user name
	// set to False if no user name available (will default to server's top posts)

	var Username = User.username;
	if (Username == null){
		Username = false;
	}

	sendHTTPRequest('POST', '/get_recommended_post', {'username': Username})

	.then(function (responseData){

		console.log(responseData)

	})

	.catch(function (error){

		console.log(error);

	})

}