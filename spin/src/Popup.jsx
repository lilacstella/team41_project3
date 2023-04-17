import React from 'react';

const Popup = ({ isOpen, onClose }) => {
    return (
        <>
            {isOpen && (
                <div className="popup-overlay" onClick={onClose}>
                    <div className="popup">
                        <button className="popup-close" onClick={onClose}>
                            &times;
                        </button>
                        <div className="popup-content">
                            <h2>Login</h2>
                            <form>
                                <label htmlFor="username">Username</label>
                                <input type="text" id="username" name="username" />
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" name="password" />
                                <button type="submit">Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Popup;