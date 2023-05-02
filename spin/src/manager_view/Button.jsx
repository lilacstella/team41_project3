/**
 * This module exports a button component for use in a React application.
 * @module Button
 * @requires "./Button.css"
*/

import "./Button.css";

export default function Button(props) {
    /**
    * Handles a click event on the button and calls the callback function provided in props to change the view
    * @function handleClick
    * @param {object} props - Component properties.
    * @returns {void}
    */
    const handleClick = () => {
        props.view(props.buttonText.toLowerCase().replace(" ", "-"));
    };

    return (
        <div className={props.className} disabled={props.disabled} onClick={handleClick}>
            <h1>{props.buttonText}</h1>
        </div>
    );
}