from flask import Flask, request
from gemini.llm import GeminiLLM
import pyautogui
from win32api import GetMonitorInfo, EnumDisplayMonitors

app = Flask(__name__)
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
    response = gemini.query_with_image("monitor.png", "What about this?")
    return {'response': response}

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