window.addEventListener("load",function(event) {

	window.otherUsername = document.getElementById('otherUsername').innerText;
	window.followBtn = document.getElementById('followingBtn');

	if (userLoggedIn() == true){

		sendHTTPRequest('POST', '/is_following', {'username': User.username, 'otherUsername': otherUsername})

		.then(function(responseData){
			if (responseData.is_following == false){
				followBtn.innerHTML = `<button class = 'btn btn-primary' onclick = "follow('${otherUsername}')">Follow<i class="fas fa-user-plus ml-2"></i></button>`;
			}
			else{
				followBtn.innerHTML = `<button class = 'btn btn-secondary' onclick = "unfollow('${otherUsername}')">Unfollow<i class="fa fa-undo ml-2"></i></button>`;
			}
		})

		.catch(function(err){

		})

	}

	else{
		followBtn.innerHTML = `<button class = 'btn btn-primary' onclick = "follow('${otherUsername}')">Follow<i class="fas fa-user-plus ml-2"></i></button>`;
	}

},false);


function follow(otherUsername){
	if (userLoggedIn() == false){
		$('#notLoggedIn').modal();
	}

	else{
		sendHTTPRequest('POST', '/follow_user', {'username': User.username, 'otherUsername': otherUsername})

		.then(function (responseData){
			window.followBtn.innerHTML = `<button class = 'btn btn-secondary' onclick = "unfollow('${otherUsername}')">Unfollow<i class="fa fa-undo ml-2"></i></button>`;
		})

		.catch(function (err){
			console.log(err);
		})
	}
}

function unfollow(otherUsername){
	if (userLoggedIn() == false){
		$('#notLoggedIn').modal();
	}

	else{
		sendHTTPRequest('POST', '/unfollow_user', {'username': User.username, 'otherUsername': otherUsername})

		.then(function (responseData){
			window.followBtn.innerHTML = `<button class = 'btn btn-primary' onclick = "follow('${otherUsername}')">Follow<i class="fas fa-user-plus ml-2"></i></button>`;
		})

		.catch(function (err){
			console.log(err);
		})
	}
}