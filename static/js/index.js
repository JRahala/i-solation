

// on page load events


window.addEventListener("load",function(event) {

	if (User.username != null){
		document.getElementById('leftContainer').innerHTML += `<center><button class = 'btn btn-primary mt-5 p-3' onclick = 'get_recommended_post()'> <h3> Load more posts ...  <i class="fas fa-plus-square"></i> </h3> </button> <br> <br> </center>`;
	}

	get_recommended_post();


},false);


// send a comment

function sendComment(el){

	var commentContent = $(el).parent().parent().find('input').val();

	if (User.username == null || User.username == false){
		User.username = 'anonymous';
	}

	var commentAuthor = User.username;
	var postHeading = $(el).parent().parent().parent().parent().find('.postHeading').text();
	var postAuthor = $(el).parent().parent().parent().parent().find('.postAuthor').text();

	alert(postAuthor);
	console.log(postAuthor);

	sendHTTPRequest('POST', '/comment_post', {'commentAuthor':commentAuthor, 'commentContent': commentContent, 'postHeading': postHeading, 'postAuthor': postAuthor})

	.then(function (responseData){
		// add comment to current comments
		var comment = responseData.comment;
		var commentBox = $(el).parent().parent().parent().parent().find('.commentBox');
		displayComment(commentBox, comment.author, comment.content);
	})

	.catch(function(err){
		console.log(err);
	})


}


// show comments

function toggleComments(el){

    $(el).next().collapse('toggle');

};



function get_recommended_post(){

	// get user name
	// set to False if no user name available (will default to server's top posts)

	var Username = User.username;
	if (Username == null){
		Username = false;
	}

	sendHTTPRequest('POST', '/get_recommended_post', {'username': Username})

	.then(function (responseData){

		for (var i = 0; i < responseData.post.length; i++){
			displayPost(responseData.post[i]);
		}

		if (Username == false){
			document.getElementById('postContainer').innerHTML += '<h2> Sign up to view more posts by the community </h2>';
		}


	})

	.catch(function (error){

		console.log(error);

	})

}


function displayPost(post){

	var t = new Date(parseInt(post.date))
	var time_string = t.toDateString();

	document.getElementById('postContainer').innerHTML += `	<div class="card mt-3 postCard">

		  <div class="card-header">
		  	<button class = 'btn btn-dark'> <span class = 'postAuthor'>${post.author}</span> </button>
		  	<p class = 'float-right text-muted postDate'> ${time_string} </p>
		  </div>

		  <div class="card-body">
		    <h5 class="card-title postHeading">${post.heading}</h5>
		    <p class="card-text postContent">${post.content}</p>
		  </div>

		  <div class="card-footer">

		  	<button class = 'btn btn-success postLikes'>
		  		${post.likes + ' '} <i class="fas fa-thumbs-up"></i>
		  	</button>

		  	<button class = 'btn btn-danger postDislikes'>
		  		${post.dislikes + ' '} <i class="fas fa-thumbs-down"></i>
		  	</button>

		  	<button class = 'btn btn-secondary' onclick = 'toggleComments(this)'>
		  		Show Comments <i class="fas fa-comments"></i>
		  	</button>

		  	<div class = 'commentBox collapse' style = 'max-height: 20vw; overflow-y: scroll'>
			  	<br>
		  	</div>

		  	<br>

		  	<div class="input-group input-group mt-2">
	            <input type="text" class="form-control" placeholder = 'type in a comment'/>
	          	<div class="input-group-btn">
		            <button type="submit" class="btn" onclick = 'sendComment(this)'> Post <i class="fas fa-paper-plane"></i> </button>
	          	</div>
        	</div>

		  </div>

		</div>`


	var commentBox = $('.postCard').last().find('.commentBox');
	console.log(commentBox);

	for (var i = 0; i < post.comments.length; i++){
		displayComment(commentBox, post.comments[i][0], post.comments[i][1]);
	}

	/*

	for (var i = 0; i < post.comments.length; i++){

		var commentAuthor = document.createElement('a');
		commentAuthor.classList = 'badge badge-info d-inline-block';
		if (post.author != 'anonymous'){
		commentAuthor.href = '/profiles/' + post.author;
		}
		commentAuthor.innerHTML = post.comments[i][0];

		var commentPost = document.createElement('p');
		commentPost.classList = 'text-muted d-inline-block ml-2';
		commentPost.innerHTML = post.comments[i][1];

		comment = document.createElement('div');
		comment.appendChild(commentAuthor);
		comment.appendChild(commentPost);
		comment.innerHTML += '<br>'

		console.log(comment);

		commentBox.append(comment);

	}

	*/

}

function displayComment(commentBox, commentAuthor, commentContent){

	var commentAuthorElement = document.createElement('a');
	commentAuthorElement.classList = 'badge badge-info d-inline-block';
	if (commentAuthor != 'anonymous'){
	commentAuthorElement.href = '/profiles/' + commentAuthor;
	}
	commentAuthorElement.innerHTML = commentAuthor;

	var commentContentElement = document.createElement('p');
	commentContentElement.classList = 'text-muted d-inline-block ml-2';
	commentContentElement.innerHTML = commentContent;

	comment = document.createElement('div');
	comment.appendChild(commentAuthorElement);
	comment.appendChild(commentContentElement);
	comment.innerHTML += '<br>'

	console.log(comment);

	commentBox.append(comment);

}