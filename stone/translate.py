import requests
import json
import functools
from easygoogletranslate import EasyGoogleTranslate

@functools.cache
def do_translate(text, target_lang):
    translator = EasyGoogleTranslate(
        source_language='en',
        target_language=target_lang,
        timeout=10
    )
    result = translator.translate(text)
    return {"translated": result}