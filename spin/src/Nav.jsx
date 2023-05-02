/**

Nav module - This module contains the navigation bar and the Weather API display.
It is responsible for displaying the navbar, including login and weather details.
@module Nav
@requires React
@requires useSWR
@requires axios
@requires './Nav.css'
@requires '.' {HOST}
*/

import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import './Nav.css';
import { HOST } from '.';

/**
 * Fetches data from a given URL using axios.
 * @function fetcher
 * @param {string} url - The URL to fetch data from.
 * @returns {object} - The data received from the API call.
*/
const fetcher = (url) => axios.get(HOST + url).then(res => res.data);

/* navbar includes login */
export default function Nav(props) {
    /**
     * Displays the navigation bar, including login and weather details.
     * @function Nav
     * @param {object} props - The props that were passed to this component.
     * @param {string} props.displayText - The text to display on the navigation bar.
     * @param {string} props.buttonText - The text to display on the button of the navigation bar.
     * @param {function} props.direct - The function to be executed when the button is clicked.
     * @returns {JSX.Element} - The JSX element that represents the navigation bar.
    */

    return (
        <nav>
            {props.buttonText === "" ? 
                <div className="logo-div">
                    <img className="menuLogo" alt="Team 41 Spin N' Stone Logo" src="logo.png"></img> 
                    <h1>Spin N' Stone</h1>
                </div> 
                : 
                <h1>{props.displayText}</h1> 
            } 
            {props.buttonText === "" ? null : <div id="google_translate_element"></div>}
            <WeatherAPIDisplay/>
            {props.buttonText === "" ? null : <button className="login-btn" onClick={props.direct}> {props.buttonText}</button> }
        </nav>
    );
}


function WeatherAPIDisplay(){
    /**
     * Displays the weather details fetched from the OpenWeatherMap API using useSWR hook.
     * @function WeatherAPIDisplay
     * @returns {JSX.Element | null} - The JSX element that displays the weather details or null.
    */
    const { data, error, isLoading } = useSWR('weather', fetcher);
    if (error) {
        return null;
    }

    if(isLoading)
        return null;

    // console.log(data)
    var weather = JSON.parse(data);
    // console.log(weather)

    var text = `Temperature at ${weather.location.name} , ${weather.location.region} is 
        ${weather.current.temperature}°F, ${weather.current.weather_descriptions[0]}`
    return(
        <h2>{text}</h2>
    )
}