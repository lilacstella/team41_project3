"""
This module provides user login functionality and interacts with a PostgreSQL database using the psycopg2 library.

Dependencies:
- psycopg2
- stone (importing SQL_CREDS constant)

Functions:
- user_login(data)

Example Usage:

data = {'email': 'example@gmail.com', 'pin': '2024'}
user = user_login(data)
print(user) # {'id': 11, 'permission': 'manager'}

"""
import psycopg2

from stone import SQL_CREDS


def user_login(data):
    """
    Function to authenticate a user and return their id and permission level
    
    Parameters:
    - data (dict): A dictionary containing user data, including their email and pin.

    Returns:
    - dict: A dictionary containing the user's ID and permission level.
    """
    if 'pin' in data:
        if data['pin'] == '2025':
            return {'id': 10, 'permission': 'server'}
        elif data['pin'] == '2024':
            return {'id': 11, 'permission': 'manager'}
        return {'id': 0, 'permission': 'customer'}
    connection = psycopg2.connect(**SQL_CREDS)
    cursor = connection.cursor()
    cursor.execute('SELECT employeeid, manager FROM employee_t WHERE email = %s', (data['email'], ))
    res = cursor.fetchone()
    print(res)
    if res:
        return {'id': res[0], 'permission': 'manager' if res[1] else 'server'}
    else:
        return {'id': 0, 'permission': 'customer'}
