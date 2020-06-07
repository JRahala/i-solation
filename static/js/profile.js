window.addEventListener("load",function(event) {

	window.otherUsername = document.getElementById('otherUsername').innerText;
	window.followBtn = document.getElementById('followingBtn');

	// format the time

	var profileDate = $('#profileDate').text();

	var t = new Date(parseInt(profileDate))
	var time_string = t.toDateString();

	$('#profileDate').text(time_string);


	if (userLoggedIn() == true){

		// edit user following buttons

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

		// fill in last posts

		sendHTTPRequest('POST', '/get_last_post', {'otherUsername': otherUsername})

		.then(function(responseData){
			var lastPost = responseData.post;
			$('#latestDate').text(milString(lastPost.date));
			$('#latestHeading').text(lastPost.heading);
			$('#latestContent').text(lastPost.content);

		})

		.catch(function(err){

		})

		// following

		sendHTTPRequest('POST', '/get_following', {'otherUsername': otherUsername})

		.then(function(responseData){
			var followList = responseData.following;
			for (var i = 0; i < followList.length; i ++){
				$('#profileFollowing').html(`<small class="card-title d-inline-block">${followList[i]}</small><a href="/profiles/${followList[i]}" class="badge badge-sm badge-primary ml-2"> Follow </a></a>`);	
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

