import "./Button.css";

export default function Button(props) {
    const handleClick = () => {
        props.view();
    };

    return (
        <div className={props.className} disabled={props.disabled} onClick={handleClick}>
            <h1>{props.buttonText}</h1>
        </div>
    );
}