
import time
import uuid


class Website:

	def __init__(self):

		self.database = {}


	def register_user(self, user):

		if not user.username in self.database:

			self.database[user.username] = [user.password, user]
			user.add_notification('Welcome', 'Welcome to i-solation, the quarantine webapp. Get started by clicking on your profile > profile page')
			
			return user

		return False
		

	def login_user(self, username, password):

		if username in self.database:

			if self.database[username][0] == password:
				return self.database[username][1]

		return False


	def get_user_by_username(self, username):

		try:
			return self.database[username][1]

		except:
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
		self.notifications = {}


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


	def add_notification(self, notification_header, notifiction_body, link = '#'):

		notification_id = time.time() * 1000 # [latest -> earliest]
		self.notifications[notification_id] = [notification_header, notifiction_body, link]

		return notification_id


	def delete_notification(self, notification_id):

		if notification_id in self.notifications:

			del self.notifications[notification_id]
			return True

		return False


	def get_notifications(self):

		return self.notifications