window.addEventListener("load",function(event) {

	window.otherUsername = document.getElementById('otherUsername');
	window.followBtn = document.getElementById('followingBtn');

	if (userLoggedIn() == true){

		sendHTTPRequest('POST', '/is_following', {'username': User.username, 'otherUsername': otherUsername})

		.then(function(responseData){
			if (responseData.is_following == true){
				followBtn.innerHTML = `<button class = 'btn btn-primary' onclick = "follow(this, ${otherUsername})">Follow<i class="fas fa-user-plus ml-2"></i></button>`;
			}
			else{
				followBtn.innerHTML = `<button class = 'btn btn-secondary' onclick = "unfollow(this, ${otherUsername})">Unfollow<i class="fa fa-undo ml-2"></i></button>`;
			}
		})

		.catch(function(err){

		})

	}

	else{
		followBtn.innerHTML = `<button class = 'btn btn-primary' onclick = "follow(this, ${otherUsername})">Follow<i class="fas fa-user-plus ml-2"></i></button>`;
	}

},false);