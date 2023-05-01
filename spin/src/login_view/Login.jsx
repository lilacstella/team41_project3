/**
 * Login Modal React component.
 * @module LoginModal
 * @requires react-bootstrap/Modal
 * @requires react-bootstrap/Button
 * @requires react-bootstrap/Form
 * @requires jwt-decode
 * @requires axios
 * @requires ..
 * @requires react
 */

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { HOST, G_CLIENT_ID } from '..';
import { useEffect } from 'react';

/**
 * LoginModal function component.
 * @function
 * @param {object} props - Component properties.
 * @param {boolean} props.showLogin - Flag to show/hide modal.
 * @param {function} props.setShowLogin - Function to set showLogin flag.
 * @returns {JSX.Element} - Login modal component.
 */

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
                    axios.post(HOST + 'auth', { 'pin': document.getElementById('loginPin').value })
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

/**
 * LoginButton function component.
 * @function
 * @param {object} props - Component properties.
 * @param {function} props.setShowLogin - Function to set showLogin flag.
 * @returns {JSX.Element} - Login button component.
 */

function LoginButton(props) {
    function handleCallback(response) {
        axios.post(HOST + 'auth', { 'email': jwt_decode(response.credential).email })
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