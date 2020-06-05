from classes import *

from flask import Flask, request, render_template, jsonify
from flask_socketio import SocketIO, emit, send

app = Flask(__name__)
socketio = SocketIO(app)

# Create web server object
server = Website()


'''
Test script
'''

myself = User('J', '123')
server.register_user(myself)

myself.add_notification('Header', 'Body')


@app.route('/')
def index():
	return render_template('index.html')


@app.route('/sign_up', methods = ['POST'])
def sign_up():

	data = request.get_json()
	response = {}

	username = data['username']
	password = data['password']

	newUser = User(username, password)


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

''' socket responses -> see if I can use as normal links?'''

@app.route('/create_post')
def create_post():
	return render_template('create_post.html')


@socketio.on('chat')
def chat(data):

    emit('chat', data)

socketio.run(app, host = '0.0.0.0', port = 4000, debug = True)