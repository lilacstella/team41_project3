import requests
import json

def get_weather():
    API_KEY = '1f451e8cde2c7cb6736f47733475b9e3'
    location = 'College Station'
    response = requests.get(f'http://api.weatherstack.com/current?access_key={API_KEY}&query={location}')
    if response.status_code == 200:
        weather_data = response.json()
        temperature = weather_data['current']['temperature']
        weather_description = weather_data['current']['weather_descriptions'][0]
        print(f'The temperature in {location} is {temperature} degrees Celsius and the weather is {weather_description}.')

        with open('weather_data.json', 'w') as f:
            json.dump(weather_data, f)
        return(weather_data)
    else:
        print('Failed to get weather data.')
