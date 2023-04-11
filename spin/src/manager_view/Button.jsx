import "./Button.css";

export default function Button(props) {
    // tells the parent component what view to display
    const handleClick = () => {
        props.view(props.buttonText.toLowerCase().replace(" ", "-"));
    };

    return (
        <div className={props.className} disabled={props.disabled} onClick={handleClick}>
            <h1>{props.buttonText}</h1>
        </div>
    );
}