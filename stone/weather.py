import requests
import json
import functools

WEATHER_API_KEY = 'e4fb6f4376fdb8e87e8284f229cc95a8'


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

        with open('weather_data.json', 'w') as f:
            json.dump(weather_data, f)
        return json.dumps(weather_data)
    else:
        print('Failed to get weather data.')
