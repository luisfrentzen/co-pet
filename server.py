import threading
import time
from flask import Flask, request
from flask_socketio import SocketIO, emit
from gemini.llm import GeminiLLM
import pyautogui
from win32api import GetMonitorInfo, EnumDisplayMonitors

app = Flask(__name__)
# socketio = SocketIO(app)
gemini = GeminiLLM()

@app.route("/conversation")
def conversation():
    question = request.args.get('question')
    response = gemini.query(question)
    return response

@app.route("/screenshot")
def screenshot():
    im = pyautogui.screenshot()
    im.save(f"monitor.png")
    width, height = im.size
    response = gemini.query_with_image("monitor.png", "Give opinion about this image as desktop pet?, from the image sent above if you are interested in some position from the screenshot you may also return the coordinate position or random coordinate inside are of 1080 x 1920 with json format {opinion,x,y}")
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

# def background_screenshot_task():
#     while True:
#         im = pyautogui.screenshot()
#         im.save(f"monitor.png")
#         response = gemini.query_with_image("monitor.png", "What about this?")
#         print(response)
#         socketio.emit('screenshot', {'data': response})
#         time.sleep(5)
        
if __name__ == '__main__':
    # background_thread = threading.Thread(target=background_screenshot_task)
    # background_thread.daemon = True
    # background_thread.start()

    # socketio.run(app, debug=True)
    app.run(debug=True)