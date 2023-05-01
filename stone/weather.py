import requests
import json
import functools

from stone import WEATHER_API_KEY

"""
This module defines a function to retrieve the current weather data of a specified location using the Weatherstack API.

Dependencies:
- requests
- json
- functools
- stone module containing the Weatherstack API key (WEATHER_API_KEY)

Functions:
- get_weather()

Example Usage:

mydatabase.get_weather()
The temperature in College Station is 75 degrees Farenheit and the weather is Partly cloudy.
"""

@functools.cache
def get_weather():
    """
    Retrieves the current weather data for a specified location using the Weatherstack API. 
    Caches the response using functools.cache.

    Args:
    - None

    Returns:
    - A JSON string containing the weather data for College Station.
    """
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
