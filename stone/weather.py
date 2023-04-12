import requests
import json
import functools

WEATHER_API_KEY = '261b3feb73601f5f3bfbe5d2f3d86ca1'


@functools.cache
def get_weather():
    location = 'College Station'
    response = requests.get(
        f'http://api.weatherstack.com/current?access_key={WEATHER_API_KEY}&query={location}&units=f')
    if response.status_code == 200:
        weather_data = response.json()
        temperature = weather_data['current']['temperature']
        weather_description = weather_data['current']['weather_descriptions'][0]
        print(
            f'The temperature in {location} is {temperature} degrees Farenheit and the weather is {weather_description}.')

        return json.dumps(weather_data)
    else:
        print('Failed to get weather data.')
