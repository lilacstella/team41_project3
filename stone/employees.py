import psycopg2

from stone import SQL_CREDS


def user_login(data):
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
def employees_create_if_not_exist():
    return 0
