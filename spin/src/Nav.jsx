import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import './Nav.css';
import { HOST } from '.';

const fetcher = (url) => axios.get(HOST + url).then(res => res.data);

/* navbar includes login */
export default function Nav(props) {

    return (
        <nav>
            <h1>{props.displayText}</h1>
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