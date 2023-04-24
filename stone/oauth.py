# API key: AIzaSyDVs28N4Zj117921HBmI6LOuGY9hX-slCY
# Origin: http://localhost:3000
# Have callback URL to redirect user after authentication

# manager Client ID: 1092009506771-l85k3kgcjh70r9fnn665hjmhma1bd67v.apps.googleusercontent.com
# manager Client secret: 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

# server Client ID 1092009506771-ckun4p9k4qd19m35po7877bqibf1ebj6.apps.googleusercontent.com
# server Client secret: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


import google.oauth2.credentials
import google.auth.transport.requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

# Set up the OAuth2 credentials using a service account
SCOPES = ['https://www.googleapis.com/auth/drive']
SERVICE_ACCOUNT_FILE = '/path/to/service-account.json'
creds = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)

# Build the Drive API client using the credentials
service = build('drive', 'v3', credentials=creds)

# Implement the OAuth2 flow to authenticate the user and generate an access token
def authenticate_user():
    # Redirect URI can be set to localhost or any valid URL
    redirect_uri = 'http://localhost:8000/oauth2callback'
    
    # Set up the OAuth2 flow
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES, redirect_uri=redirect_uri)
    
    # Generate the authorization URL and prompt the user to visit it
    authorization_url, state = flow.authorization_url(access_type='offline')
    print('Please visit this URL to authorize the application: {}'.format(authorization_url))
    
    # After authorization, retrieve the authorization code and exchange it for an access token
    authorization_response = input('Enter the full callback URL: ')
    flow.fetch_token(authorization_response=authorization_response)
    
    # Return the access token
    return flow.credentials.token

# Check the user's role based on their login credentials
def get_user_role(username, password):
    # Replace this with your own logic to check the user's role
    if username == 'manager' and password == 'password':
        return 'manager'
    elif username == 'server' and password == 'password':
        return 'server'
    else:
        return None

# Use the appropriate credentials to generate a token with the necessary scopes and permissions
def generate_token(username, password):
    # Authenticate the user and get their access token
    access_token = authenticate_user()

    # Check the user's role
    user_role = get_user_role(username, password)
    
    # Generate a token with the appropriate credentials and scopes based on the user's role
    if user_role == 'manager':
        manager_creds = google.oauth2.credentials.Credentials.from_authorized_user_info(
            creds.client_id, creds.client_secret, access_token=access_token, scopes=['https://www.googleapis.com/auth/drive'])
        # Use the manager credentials to perform actions as a manager
        # ...
        # Return the manager token
        return manager_creds.token
    elif user_role == 'server':
        server_creds = google.oauth2.credentials.Credentials.from_authorized_user_info(
            creds.client_id, creds.client_secret, access_token=access_token, scopes=['https://www.googleapis.com/auth/drive'])
       





# import requests
# from google.oauth2 import service_account

# # Set up the Google API credentials for the service account
# SCOPES = ['https://www.googleapis.com/auth/drive']
# SERVICE_ACCOUNT_FILE = '/path/to/service-account.json'

# # Create a credentials object for the service account
# creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)

# # Define a function to obtain an access token based on the user's role
# def get_access_token(role):
#     if role == 'manager':
#         # Set up the API request parameters for obtaining an access token for a manager
#         params = {
#             'grant_type': 'refresh_token',
#             'client_id': '1092009506771-l85k3kgcjh70r9fnn665hjmhma1bd67v.apps.googleusercontent.com',
#             'client_secret': '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',
#             'refresh_token': 'your_manager_refresh_token'
#         }
#     elif role == 'server':
#         # Set up the API request parameters for obtaining an access token for a server
#         params = {
#             'grant_type': 'client_credentials',
#             'client_id': creds.client_id,
#             'client_secret': creds.client_secret,
#             'scope': 'https://www.googleapis.com/auth/drive'
#         }
#     else:
#         raise ValueError(f'Invalid role: {role}')

#     # Make the API request to obtain an access token
#     response = requests.post('https://oauth2.googleapis.com/token', data=params)
#     token = response.json()['access_token']
    
#     return token
