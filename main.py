from classes import *

from flask import Flask, request, render_template, jsonify
from flask_socketio import SocketIO, emit, send, join_room, leave_room

app = Flask(__name__)
socketio = SocketIO(app)

# Create web server object
server = Website()


'''
Test script
'''

myself = User('Jasamrit', 'J123', server)
server.register_user(myself)

myself.add_notification('Header', 'Body')
myself.create_post('Heading', 'Content')
myself.create_post('My blog day 1', 'Content')
myself.create_post('Anyone have any good dieting tips', 'Content')
myself.create_post('Does anyone want to start up this charity idea', 'Content')
myself.create_post('Can anyone help me out with this project?', 'Content')
myself.create_post('Heading', 'Content')
myself.create_post('Thank you for all the support I have recieved on here', 'Content')
myself.create_post('New food ideas?', 'Content')
myself.create_post('New heading', 'Content')
myself.create_post('Heading', 'Content')
myself.create_post('Heading', 'Content')
myself.create_post('Heading', 'Content')


@app.route('/')
def index():
	return render_template('index.html')


@app.route('/sign_up', methods = ['POST'])
def sign_up():

	data = request.get_json()
	response = {}

	username = data['username']
	password = data['password']

	newUser = User(username, password, server)


	if server.register_user(newUser):
		response['response'] = 'Account successfully created!'
		response['worked'] = True

	else:
		response['response'] = 'Username already exists!'
		response['worked'] = False


	return jsonify(response)


@app.route('/login', methods = ['POST'])
def login():

	data = request.get_json()
	response = {}

	username = data['username']
	password = data['password']

	if server.login_user(username, password):
		response['response'] = 'Account successfully logged in!'
		response['worked'] = True

	else:
		response['response'] = 'Username / password incorrect!'
		response['worked'] = False


	return jsonify(response)


@app.route('/delete_notification', methods = ['POST'])
def delete_notification():

	data = request.get_json()
	response = {'response': 'notification deleted'}

	# get the current user 
	user = data['username']
	user = server.get_user_by_username(user)

	if not user:
		response['response'] = 'user not recognised!'

	else:

		# get notification id
		notification_id = data['notification_id']
		result = user.delete_notification(notification_id)

		if not result:
			response['response'] = 'notification doesn\'t exist!'

		# deleted notification

	return jsonify(response)


@app.route('/get_notifications', methods = ['POST'])
def get_notifications():

	data = request.get_json()
	response = {'worked': True, 'notifications': []}

	# get the current user 
	user = data['username']
	user = server.get_user_by_username(user)

	if not user:
		response['worked'] = False

	else:
		response['notifications'] = user.get_notifications()

	return jsonify(response)



# create an active and unactive user property so that if I try to access user data from the database without being logged in, the databse will return nothing
# this requires the password to have been previously typed in
# when the user logs in / signs up the active = True
# on window.close -> user.active = False

@app.route('/get_posts', methods = ['POST'])
def get_posts():

	response = {}
	data = request.get_json()

	user = data['username']
	user = server.get_user_by_username(user)

	response['posts'] = [user.posts[post].serialise(False) for post in user.posts]

	return jsonify(response)


@app.route('/edit_post', methods = ['POST'])
def edit_post():

	response = {'worked': True, 'error': False}
	data = request.get_json()

	user = data['username']
	user = server.get_user_by_username(user)



	original_heading = data['original_heading']
	new_heading = data['new_heading']
	new_content = data['new_content']

	response['new_heading'] =  data['new_heading']
	response['new_content'] =  data['new_content']

	if not user.edit_post(original_heading, new_heading, new_content):

		response['worked'] = False
		response['error'] = 'You already have a post with the same heading'

	return jsonify(response)


@app.route('/create_new_post', methods = ['POST'])
def create_new_post():

	response = {}
	data = request.get_json()

	user = data['username']
	user = server.get_user_by_username(user)

	heading = data['heading']
	content = data['content']

	post = user.create_post(heading, content)

	if not post:
		response['worked'] = False
		response['error'] = 'You already have a post with the same heading'

	else:
		response['worked'] = True
		response['post'] = post.serialise()

	return jsonify(response)


@app.route('/delete_post', methods = ['POST'])
def delete_post():

	response = {}
	data = request.get_json()

	user = data['username']
	user = server.get_user_by_username(user)

	heading = data['heading']

	if user.delete_post(heading):
		response['worked'] = True

	else:
		response['worked'] = False

	return jsonify(response)


''' socket responses -> see if I can use as normal links?'''

@app.route('/create_post')
def create_post():
	return render_template('create_post.html')


@app.route('/get_recommended_post', methods = ['POST'])
def get_recommended_post():

	response = {}
	data = request.get_json()

	user = data['username']
	user = server.get_user_by_username(user)

	# Serialise generator -> for post 
	# Implement session_id system

	if not user:
		server_post_generator = server.get_top_posts()
		response['post'] = []
		for i in range(10):
			response['post'].append(next(server_post_generator))

	else:
		response['post'] = []
		for i in range(10):
			response['post'].append(next(user.post_generator))

	return jsonify(response)


@app.route('/comment_post', methods = ['POST'])
def comment_post():
	#'commentAuthor':commentAuthor, 'commentContent': commentContent, 'postHeading': postHeading, 'postAuthor': postAuthor})
	response = {}
	data = request.get_json()

	user = data['postAuthor']
	user = server.get_user_by_username(user)

	user.comment_post(data['postHeading'], data['commentAuthor'], data['commentContent'])
	response['comment'] = {'author': data['commentAuthor'], 'content': data['commentContent']}
	return jsonify(response)


@app.route('/comment_vote', methods = ['POST'])
def comment_vote():

	response = {}
	data = request.get_json()

	user = data['postAuthor']
	user = server.get_user_by_username(user)

	response['newValues'] = user.comment_vote(data['postHeading'], data['voteAuthor'], data['voteType'])
	return jsonify(response)


@app.route('/profiles/<profile_name>')
def profiles(profile_name = ''):

	user = profile_name
	user = server.get_user_by_username(user)

	return render_template('profile.html', user = user)


@app.route('/is_following', methods = ['POST'])
def is_following():

	response = {}
	data = request.get_json()

	user = data['username']
	user = server.get_user_by_username(user)

	other_username = data['otherUsername']
	other_user = server.get_user_by_username(other_username)

	response['is_following'] = user.is_following(other_user)

	return jsonify(response)


@app.route('/follow_user', methods = ['POST'])
def follow_user():

	response = {}
	data = request.get_json()

	user = data['username']
	user = server.get_user_by_username(user)

	other_username = data['otherUsername']
	other_username = server.get_user_by_username(other_username)

	user.follow_user(other_username)

	return jsonify(response)


@app.route('/unfollow_user', methods = ['POST'])
def unfollow_user():

	response = {}
	data = request.get_json()

	user = data['username']
	user = server.get_user_by_username(user)

	other_username = data['otherUsername']
	other_username = server.get_user_by_username(other_username)

	user.unfollow_user(other_username)

	return jsonify(response)


@app.route('/get_last_post', methods = ['POST'])
def get_last_post():

	response = {}
	data = request.get_json()

	other_username = data['otherUsername']
	other_user = server.get_user_by_username(other_username)

	response['post'] = other_user.get_last_post()

	return jsonify(response)


@app.route('/get_following', methods = ['POST'])
def get_following():

	response = {}
	data = request.get_json()

	other_username = data['otherUsername']
	other_user = server.get_user_by_username(other_username)

	response['following'] = other_user.get_following()

	return jsonify(response)


@app.route('/messages/')
def messages():
	return render_template('messages.html')


@app.route('/start_conversation', methods = ['POST'])
def start_conversation():

	response = {}
	data = request.get_json()

	user = data['username']
	user = server.get_user_by_username(user)

	conversation_name = data['conversationName']
	if user.start_conversation(conversation_name):

		response['worked'] = True
		response['conversationName'] = conversation_name

	else:

		response['worked'] = False
		response['error'] = 'Name already in use for another group'

	return jsonify(response)


@app.route('/get_conversations', methods = ['POST'])
def get_conversations():

	response = {}
	data = request.get_json()

	user = data['username']
	user = server.get_user_by_username(user)

	response['allConversations'] = user.get_conversations()

	return jsonify(response)


@app.route('/get_conversation_by_name', methods = ['POST'])
def get_conversation_by_name():

	response = {}
	data = request.get_json()

	user = data['username']
	user = server.get_user_by_username(user)

	conversation_name = data['conversationName']

	response['conversation'] = user.get_conversation_by_name(conversation_name).serialise()

	return jsonify(response)


'''
@socketio.on('chat')
def chat(data):

    emit('chat', data)

'''

ROOMS = []

# joining room handler

@socketio.on('join')
def on_join(data):

	# username
    username = data["username"]
    room = data["room"]
    join_room(room)

    # Notofication about new user joined room
    emit('chat', {'msg': f'{username} has joined the room', 'author': 'server', 'time': time.time() * 1000}, room=room, broadcast = True)


@socketio.on('leave')
def on_leave(data):

	#notify users that user is leaving
	leave_room(data['room'])
	emit('chat', {'msg': data['username'] + " has left the " + data['room'], 'author': 'server', 'time': time.time() * 1000}, room = data['room'], broadcast = True)


@socketio.on('new_room')
def new_room(data):

    ROOMS.append(data['room'])
    room = data['room']
    username = data['username']
    join_room(data['room'])
    # Notification about new user joined room
    emit('chat', {'msg': username + " has created the " + room + " room", 'author': 'server', 'time': time.time() * 1000}, room = room, broadcast = True)



@socketio.on('chat')
def chat(data):

	# get parameters from chat data sent
	conversationName = data['room']
	messageAuthor = data['username']
	messageContent = data['content']

	# get the user object and conversation object
	user = server.get_user_by_username(messageAuthor)
	conversation = user.get_conversation_by_name(conversationName)

	# update the chat history
	conversation.chat(user, messageContent)

	#emit the chat to the current room to all users
	emit('chat', {'msg': messageContent, 'author': messageAuthor, 'time': time.time() * 1000}, room = conversationName, broadcast = True)


# render community.html
@app.route('/community')
def community():

	return render_template('community.html')


@app.route('/physical_fitness')
def physical_fitness():

	return render_template('physical_fitness.html')


@app.route('/childrens')
def childrens():

	return render_template('childrens.html')


@app.route('/hero')
def hero():

	return render_template('hero.html')


socketio.run(app, host = '0.0.0.0', port = 4000, debug = True)