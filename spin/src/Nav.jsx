import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import './Nav.css';

const fetcher = (url) => axios.get(url).then(res => res.data);

/* navbar includes login */
export default function Navbar(props) {
    const handleClick = () => {
        props.setView(props.direct);
    };

    return (
        <nav>
            <h1>{props.displayText}</h1>
            <WeatherAPIDisplay/>
            <button className="login-btn" onClick={handleClick}>{props.buttonText}</button>
        </nav>
    );
}


function WeatherAPIDisplay(){
    const { data, error, isLoading } = useSWR('http://localhost:5000/weather', fetcher);
    if (error) {
        return <h2></h2>;
    }

    if(isLoading)
        return <h2></h2>;

    // console.log(data)
    var weather = JSON.parse(data);
    // console.log(weather)

    var text = `Temperature at ${weather.location.name} , ${weather.location.region} is 
        ${weather.current.temperature}°F, ${weather.current.weather_descriptions[0]}`
    return(
        <h2>{text}</h2>
    )
}