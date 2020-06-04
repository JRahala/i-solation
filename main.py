from classes import *

from flask import Flask, request, render_template, jsonify
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

# Create web server object
server = Website()

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

	response = {'response': 'notification deleted'}

	# get the current user 
	# get notifcation id
	# delete notification

	print('Delete notification request')

	return jsonify(response)


socketio.run(app, host = '0.0.0.0', port = 4000, debug = True)