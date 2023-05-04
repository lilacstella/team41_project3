import React from 'react';
import useSWR from 'swr';
import './Nav.css';
import { fetcher } from '.';

/* navbar includes login */
export default function Nav(props) {

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