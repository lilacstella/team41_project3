import "./Button.css";

export default function Button(props) {
    return (
        <div className="button">
            <h1>{props.buttonText}</h1>
        </div>
    );
}