
import time


class Website:

	def __init__(self):

		self.database = {}


	def register_user(self, user):

		if not user.username in self.database:

			self.database[user.username] = [user.password, user]
			return user

		return False
		

	def login_user(self, username, password):

		if username in self.database:

			if self.database[username][0] == password:
				return self.database[username][1]

		return False



class Post:

	Instances = []

	def __init__(self, heading, content, author):

		Post.Instances.append(self)

		self.heading = heading
		self.content = content
		self.author = author

		self.votes = 0
		self.date = time.localtime()
		self.comments = []


	def edit(self, new_heading, new_content):

		if new_heading != self.heading:

			if new_heading in self.author.posts: 
				return False

			self.author.posts[new_heading] = self.author.posts[self.heading]
			del self.author.posts[self.heading]

		self.heading = new_heading
		self.content = new_content

		return self


class User:

	def __init__(self, username, password):

		self.username = username
		self.password = password

		self.posts = {}
		self.reputation = 0


	def create_post(self, heading, content):

		if not heading in self.posts:

			post = Post(heading, content, self)
			self.posts[post.heading] = post

			return post

		return False


	def delete_post(self, heading):

		if heading in self.posts:

			post = self.posts[heading]
			del self.posts[heading], post

			return True

		return False


	def edit_post(self, heading, new_heading = False, new_content = False):

		post = self.posts[heading]

		if not new_heading: new_heading = post.heading
		if not new_content: new_content = post.content
		
		return post.edit(new_heading, new_content)
