from flask import Flask, request
import requests

app = Flask(__name__)

@app.route('/translate', methods=['POST'])
def translate():
    url = "https://translation.googleapis.com/language/translate/v2"
    text = request.form['text']
    source = "en"  
    target = request.form['target']  
    key = "4f412d146b59140e6956df06fe6f06117ec1514d"  

    # Translate text to target language
    params = {"key": key, "q": text, "source": source, "target": target}
    response = requests.post(url, params=params)
    if response.status_code == 200:
        translated_text = response.json()["data"]["translations"][0]["translatedText"]
        return translated_text
    else:
        return "Translation failed."

# if __name__ == '__main__':
#     app.run()
