
import time
import uuid


class Conversation:

	def __init__(self, owner, name):

		self.name = name
		self.owner = owner
		self.allowed = set([owner])

		self.history = [] # [username, msg, time]
		self.pending = set()
		self.public = False # private conversation -> owner edits this (public for charity / group stuff)


	# add a message in the group chat

	def chat(self, user, msg):

		# add to message history
		self.history.append([user.username, msg, time.time() * 1000])


	# request acces to chat in the conversation
	def request_access(self, requester):

		# notify the owner of the group (with notification)
		self.owner.add_notification(f'{self.name} request', f'{requester.username} has requested access to group: {self.name}', link = '#')
		self.pending.add(requester)


	# allow acces to the requester, with the owners permission
	def allow_access(self, requester):

		# alert the requester
		requester.add_notification(f'You have been accepted into group: {self.name}')

		# notify all group members
		for user in self.allowed:
			user.add_notification(f'{requester.username} have been added into group: {self.name}')

		# remove pending request
		self.pending.remove(requester)


	# deny the requester access
	def deny_access(self, requester):

		# alert the requester
		requester.add_notification(f'You have been denied from group: {self.name}')

		# remove pending request
		self.pending.remove(requester)


	# serialise the object for JSON packaging (as far message displaying needs to know)
	def serialise(self):

		return {'name': self.name, 'owner': self.owner.username, 'allowed': [user.username for user in self.allowed], 'history': self.history, 'pending': [user.username for user in self.pending]}


	# edit visibility (public / privacy) of conservation
	def make_public(self, newName):

		# this name for a project has been taken
		if newName in self.user.server:
			return False

		else:

			# make the identifier for the project 

			self.name = newName

			self.public = True
			self.user.server.projects[self.name] = self

			# notify users of project 

			for follower in self.user.followers:
				follower.add_notification(f'{self.user.username} started a public project {self.name}', 'help back them')

			return newName




class Website:

	def __init__(self):

		self.database = {}
		self.all_users = set()
		self.anon_sessions = {}
		self.projects = {}


	# def generate_session():

	# 	# generate and returns unique session id -> User object

	# 	session_id = uuid.uuid1()
	# 	self.anon_sessions[session_id] = User(session_id, session_id)

	# 	return session_id


	# def delete_session():

	# 	# on page leaving delete temporary user
		
	# 	session_user = self.anon_sessions[session_id]
	# 	del session_user, self.anon_sessions[session_id]

	# 	return True



	def register_user(self, user):

		if not user.username in self.database:

			self.database[user.username] = [user.password, user]
			self.all_users.add(user)
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


	# def get_top_post(self):

	# 	# this could be better

	# 	for user in self.all_users():
	# 		for post in user.posts:
	# 			yield post.serialise(True)

	# 	yield Post('No more posts', 'No more posts', User('No more posts', 'No more posts')).serialise(True)


	def get_top_posts(self):

		# returns a list of up to 20 generic posts by users
		# turn into a generator and yield one

		for user in self.all_users:
			for post in user.posts:
				yield user.posts[post].serialise(True)
				

		while True:
			yield(Post('Ran out of posts', 'Ran out of posts', User('', '', self)).serialise(True))





class Post:

	Instances = []

	def __init__(self, heading, content, author):

		Post.Instances.append(self)

		self.heading = heading
		self.content = content
		self.author = author

		self.likes = 0
		self.dislikes = 0

		self.likers = set()
		self.dislikers = set()

		self.date = time.time() * 1000
		#self.comments = [['Author', 'Comment'], ['Author 2', 'Comment 2']]
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


	# for some reason this post object will not serialise (probably due to the author object)

	def serialise(self, comments = False):

		response =  {'heading': self.heading, 'content': self.content, 'author': self.author.username, 'likes': self.likes, 'dislikes': self.dislikes, 'date': self.date}
		if comments: response['comments'] = self.comments
		
		return response


class User:

	def __init__(self, username, password, server):

		self.username = username
		self.password = password
		self.server = server
		self.bio = 'Hello I am a new user'
		self.date = time.time() * 1000

		self.posts = {}
		self.reputation = 0
		self.notifications = {}
		self.followers = set()
		self.following = set()
		self.viewed_posts = set()
		self.post_generator = self.get_recommended()
		self.last_post = Post('This person has made no posts', '----', self)
		self.conversations = {'Start your first conversation by clicking "create new group"': Conversation(self, 'Start your first conversation by clicking "create new group"')}



	def create_post(self, heading, content):

		if not heading in self.posts:

			post = Post(heading, content, self)
			self.posts[post.heading] = post

			for user in self.followers:
				user.add_notification(self.username, f'has just posted {post.heading}')

			self.last_post = post

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


	def get_recommended(self):

		get_from_server = self.server.get_top_posts()

		for user in self.following:
			for post in user.posts:

				if not user.posts[post] in self.viewed_posts:
					self.viewed_posts.add(user.posts[post])

					yield post.serialise(True)

		while True:
			yield next(get_from_server)


	def comment_post(self, post_heading, comment_author, comment_content):

		try:
			post = self.posts[post_heading]
			post.comments.append([comment_author, comment_content])

		except:
			pass
			
		return comment_author, comment_content


	def comment_vote(self, post_heading, vote_author, vote_type):

		# returns new number of up/down votes

		post = self.posts[post_heading]

		if vote_type == 1:

			if vote_author in post.likers:
				# undo vote
				post.likes -= 1
				post.likers.remove(vote_author)

			else:

				# make postitive vote

				if vote_author in post.dislikers:

					# undo vote
					post.dislikes -= 1
					post.dislikers.remove(vote_author)

				post.likers.add(vote_author)
				post.likes += 1


		else:

			if vote_author in post.dislikers:
				# undo vote
				post.dislikes -= 1
				post.dislikers.remove(vote_author)

			else:

				# make postitive vote

				if vote_author in post.likers:

					# undo vote
					post.likes -= 1
					post.likers.remove(vote_author)

				post.dislikers.add(vote_author)
				post.dislikes += 1


		return post.likes, post.dislikes


	def is_following(self, other_user):

		return other_user in self.following


	def follow_user(self, other_user):

		self.following.add(other_user)
		other_user.followers.add(self)


	def unfollow_user(self, other_user):

		if other_user in self.following:
			self.following.remove(other_user)

		if self in other_user.followers:
			other_user.followers.remove(self)


	def get_last_post(self):

		return self.last_post.serialise()

	def get_following(self):

		return [user.username for user in self.following]


	def start_conversation(self, conversation_name):

		if not conversation_name in self.conversations:
			self.conversations[conversation_name] = Conversation(self, 'conversation_name')
			return self.conversations[conversation_name]

		else:
			return False


	def get_conversation_by_name(self, conversation_name):

		if conversation_name in self.conversations:
			return self.conversations[conversation_name]

		else:
			return False

	def get_conversations(self):

		return [conversation for conversation in self.conversations]


