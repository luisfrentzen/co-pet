from flask import Flask, request
from flask_socketio import SocketIO
from gemini.llm import GeminiLLM
import pyautogui
import time
import threading

app = Flask(__name__)
socketio = SocketIO(app)
gemini = GeminiLLM()

last_request_time = time.time()
request_timeout = 10

@app.route("/conversation")
def conversation():
    global last_request_time
    last_request_time = time.time()
    question = request.args.get('question')
    parts = question.split()
    command = parts[0]
    arguments = " ".join(parts[1:])
    if command.startswith('/search'):
        response = gemini.query_search(arguments)
    else:
        response = gemini.query(question)
    return response

@app.route("/screenshot")
def screenshot():
    global last_request_time
    last_request_time = time.time()
    im = pyautogui.screenshot()
    im.save(f"monitor.png")
    width, height = im.size
    response = gemini.query_with_image("monitor.png", "Describe the image")
    return {'response': response, 'screen_size': {
        'width': width,
        'height': height
    }}

@app.route("/history")
def history():
    pass

@app.route("/reset-history")
def reset_history():
    gemini.reset_history()
    return {'response': 'History been reset'}
    
@app.route("/screen-info")
def screen_info():
    pass

@app.route('/directory/<path:dir>')
def directory(dir):
   response = gemini.query_directory(dir)
   socketio.emit('directory', {'data': response})
   return response

def background_screenshot_task():
    global last_request_time
    while True:
        if time.time() - last_request_time > request_timeout:
            im = pyautogui.screenshot()
            im.save(f"monitor.png")
            response = gemini.query_with_image("monitor.png", "Describe the image")
            last_request_time = time.time()
            socketio.emit('screenshot', {'data': response})
            time.sleep(5)
        else:
            time.sleep(1)
        
if __name__ == '__main__':
    background_thread = threading.Thread(target=background_screenshot_task)
    background_thread.daemon = True
    background_thread.start()
    socketio.run(app, debug=True)
    # app.run(debug=True)

