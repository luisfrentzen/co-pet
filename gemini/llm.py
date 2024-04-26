import os
import PIL.Image
import google.generativeai as genai
from google.generativeai.types import content_types
from dotenv import load_dotenv
from .prompts import SYSTEM_PET, SYSTEM_VISION, MODEL_AFFIRM

load_dotenv()

def list_files(directory):
    dir_len = len(directory)
    file_list = []
    for root, dirs, files in os.walk(directory):
        # Remove hidden directories
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        for file in files:
            if not file.startswith('.'):
                file_list.append(os.path.join(root, file)[dir_len:])
    return file_list

class GeminiLLM():
    def __init__(self, max_n_history=20):
        genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

        self.chat_model = genai.GenerativeModel('gemini-pro')
        self.vision_model = genai.GenerativeModel('gemini-pro-vision')

        self.vision_prompt = SYSTEM_VISION
        self.system_prompt = SYSTEM_PET
        self.affirm = MODEL_AFFIRM

        self.content_to_prepend = [
            content_types.to_content({"role": "user", "parts": SYSTEM_PET}), 
            content_types.to_content({"role": "model", "parts": MODEL_AFFIRM})
        ]

        self.chat = self.chat_model.start_chat(history=self.content_to_prepend)
        self.max_n_history = max_n_history

    def prepend_system_prompt(self, clean_history):
        return [*self.content_to_prepend, *clean_history]

    def pop_history(self):
        if len(self.chat.history[2:]) <= self.max_n_history:
            return
        
        chats = self.chat.history[2:]
        self.chat.history = self.prepend_system_prompt(chats[2:])
    
    def reset_history(self):
        self.chat.history = []

    def query(self, prompt):
        response = self.chat.send_message(prompt)
        self.pop_history()
        return response.text
        
    def query_with_image(self, image, prompt=None):
        if prompt is None:
            prompt = self.vision_prompt
        
        img = PIL.Image.open(image)

        described = self.vision_model.generate_content(["Describe what's on the image in detail", img])
        described.resolve()
        additional_response = self.query("Given a description:\n" + described.text + "\nIs the description has anything related to what's have been discussed by us? If there's then answer with \"Yes\" as the first word, otherwise \"No\" as the first word" )

        response = self.vision_model.generate_content([prompt, img])
        response.resolve()

        c = content_types.to_content({"role": "user", "parts": prompt})
        self.chat.history.append(c)
        c = content_types.to_content({"role": "model", "parts": response.text})
        self.chat.history.append(c)
        self.pop_history()

        initial_response = response.text
        
        return {"initial_response": initial_response, "additional_response": additional_response}
    
    def query_directory(self, directory):
        all_files = list_files(directory)
        all_files = str(all_files)

        prompt = f"Given a directory named {directory}\n"
        prompt += "\n"
        prompt += f"And all the files names and its subdirectories inside\n"
        prompt += f"{all_files}\n"
        prompt += "\n"
        prompt += "Interpret or figure out what is the main content of the given directory by knowing the filenames and the subdirectorie names only.\n"
        prompt += "And any thoughts or insights or comments regarding the directory? maybe something that can be improved?"

        response = self.chat.send_message(prompt)
        self.pop_history()
        return response.text

    
    def append_history(self, user_query, model_response):
        c = content_types.to_content({"role": "user", "parts": user_query})
        self.chat.history.append(c)
        c = content_types.to_content({"role": "model", "parts": model_response})
        self.chat.history.append(c)

if __name__ == "__main__":
    gemini = GeminiLLM()
    gemini.append_history("Hello, How are you?", "Amazing, always happy to help you, how can I help you?")
    response = gemini.query("Which is one of the best place to visit in India during summer?")
    print(response)
    response = gemini.query("Tell me more about that place in 50 words")
    print(response)

    gemini.reset_history()

    response = gemini.query("I'd like to play some multiplayer online game, I heard a lot about league of legends or dota, what do you think?")
    print(response)
    response = gemini.query_with_image("D:\Visto\co-pet\sample-inputs\dota2.png", "What about this?")
    print(response)
    response = gemini.query("What's other games have similar genre?")
    print(response)

    gemini.reset_history()

    response = gemini.query("How do I make chicken noodle soup?")
    print(response)
    response = gemini.query_with_image("D:\Visto\co-pet\sample-inputs\dota2.png", "What about this?")
    print(response)
    response = gemini.query("What's other games have similar genre?")
    print(response)

    gemini.reset_history()

    response = gemini.query_directory("D:\Visto\co-pet")
    print(response)
    