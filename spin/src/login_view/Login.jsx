import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import jwt_decode from 'jwt-decode';
import { sender, G_CLIENT_ID } from '..';
import { useEffect } from 'react';

export default function LoginModal(props) {
    const { showLogin, setShowLogin } = props;
    return (
        <Modal show={showLogin} onHide={() => setShowLogin(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Control id="loginPin" type="text" placeholder="Enter your pin" />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={() => {
                    sender('auth', { 'pin': document.getElementById('loginPin').value })
                        .then(res => {
                            localStorage.setItem('employee_id', res.data.id);
                            localStorage.setItem('employee_permission', res.data.permission);
                            setShowLogin(false);
                        })
                }}>
                    Sign in with Pin
                </Button>
                <LoginButton setShowLogin={setShowLogin}/>
            </Modal.Footer>
        </Modal>
    )
}



function LoginButton(props) {
    function handleCallback(response) {
        sender('auth', { 'email': jwt_decode(response.credential).email })
            .then(res => {
                localStorage.setItem('employee_id', res.data.id);
                localStorage.setItem('employee_permission', res.data.permission);
                props.setShowLogin(false);
            })
    }

    useEffect(() => {
            /* global google */
        google.accounts.id.initialize({
            client_id: G_CLIENT_ID,
            callback: handleCallback
        })

        google.accounts.id.renderButton(
            document.getElementById("loginButton"),
            { theme: "outline", size: "large" }
        )
    }, []);


    return (
        <div id="loginButton"></div>
    )
}