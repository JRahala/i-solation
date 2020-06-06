

// on page load events


window.addEventListener("load",function(event) {

	if (User.username != null){
		document.getElementById('leftContainer').innerHTML += `<center><button class = 'btn btn-primary mt-5 p-3' onclick = 'get_recommended_post()'> <h3> Load more posts ...  <i class="fas fa-plus-square"></i> </h3> </button> <br> <br> </center>`;
	}

	get_recommended_post();


},false);


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
		  	<button class = 'btn btn-dark postAuthor'> ${post.author} </button>
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

		  	<button class = 'btn btn-primary' onclick = 'toggleComments(this)'>
		  		Load Comments <i class="fas fa-comments"></i>
		  	</button>

		  	<div class = 'commentBox collapse'>
			  	<br>
		  	</div>

		  </div>

		</div>`


	var commentBox = $('.postCard').last().find('.commentBox');
	console.log(commentBox);


	for (var i = 0; i < post.comments.length; i++){

		var commentAuthor = document.createElement('a');
		commentAuthor.classList = 'badge badge-info d-inline-block';
		commentAuthor.href = '/profiles/' + post.author;
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


}