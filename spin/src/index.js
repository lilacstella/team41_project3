import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';
import './index.css';
// import reportWebVitals from './reportWebVitals';


export const HOST = 'http://localhost:5000/';
export const G_CLIENT_ID = '257525904215-rj4iugd6avdihsnv7p0iuadsv8c91lgj.apps.googleusercontent.com';
export const fetcher = (url) => axios.get(HOST + url).then(response => response.data);
export const sender = (url, body) => axios.post(HOST + url, body);


// Add a script tag to the document to load the Google Translate API
const script = document.createElement("script");
script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
script.async = true;
document.body.appendChild(script);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div>
      <App />
    </div>
  </React.StrictMode>
);

// Initialize the Google Translate API when the script has finished loading
window.googleTranslateElementInit = function () {
  new window.google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
};
