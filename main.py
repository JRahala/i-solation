from classes import *


myWebsite = Website()

Jasamrit = User('Jasamrit', 'Rahala')
registered_user = myWebsite.register_user(Jasamrit)

print(registered_user.username, registered_user.password)

Jasamrit.create_post('Header', 'Content')
Jasamrit.delete_post('Header')

Jasamrit.create_post('A', 'B')

Jasamrit.edit_post('A', 'B', 'C')

print(Jasamrit.posts)
print(Jasamrit.posts['B'])


'''
from flask import Flask, request, render_template, jsonify
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)


@app.route('/')
def index():
	return '<h> Index test </h>'


socketio.run(app, host = '0.0.0.0', port = 5000)
'''