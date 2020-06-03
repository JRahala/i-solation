from classes import *

from flask import Flask, request, render_template, jsonify
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():

	return render_template('index.html')


socketio.run(app, host = '0.0.0.0', port = 4000, debug = True)