"""
This module interacts with a PostgreSQL database to retrieve order information and delete orders.

Dependencies:
- psycopg2
- json
- stone (contains SQL credentials)

Functions:
- get_orders(date)
- remove_order(json_file)

Example Usage:

To retrieve all orders from April 1st, 2023:
orders = get_orders('2023-04-01')
print(orders)

To remove an order with the order number '1234':
order_info = {'ordernumber': '1234'}
remove_order(order_info)

"""
import psycopg2
import json

from stone import SQL_CREDS


def get_orders(date):
    """
    Retrieves all orders from the order_history table that were ordered on the specified date.
    Parameters:
    - date (str): Date in format 'YYYY-MM-DD' for which orders should be retrieved.

    Returns:
    - list of dictionaries: Each dictionary contains information for a single order, including Order #, Total,
    Time, Employee, and Payment Form.

    Example Usage:
    
    get_orders('2022-01-01')

    [{'Order #': 1, 'Total': 10.0, 'Time': datetime.datetime(2022, 1, 1, 12, 0), 'Employee': 'John Smith', 'Payment Form': 'Credit Card'}, 
    {'Order #': 2, 'Total': 15.0, 'Time': datetime.datetime(2022, 1, 1, 13, 0), 'Employee': 'Jane Doe', 'Payment Form': 'Cash'}]

    """
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
        cursor = connection.cursor()
        # Update the inventory with the specified item and restock amount using a parameterized query
        order_history_query = ("SELECT * FROM order_history where date(orderedat) = %s")
        cursor.execute(order_history_query,(date,))
        orders = cursor.fetchall()
        order_list = []
        for row in orders:
            orderdata = {"Order #": row[0], "Total": row[1],
                         "Time": row[3], "Employee": row[4], "Payment Form": row[2]}
            order_list.append(orderdata)
        
        # Return as a JSON string
        return order_list
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")

def remove_order(json_file):
    """
    Deletes the order and all associated items from the order_history and orderitem_t tables.

    Parameters:
    - json_file (dictionary): Contains the order number to be deleted.

    Returns:
    - bool: True if the order was successfully deleted, False otherwise.   

    Example Usage:

    remove_order(order_data)

    True

    """
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
        cursor = connection.cursor()
        delete_inv_query = "delete from orderitem_t where ordernumber = %s"
        delete_order_history_query = "delete from order_history where ordernumber = %s"
        cursor.execute(delete_inv_query, (json_file["ordernumber"],))
        connection.commit()
        cursor.execute(delete_order_history_query, (json_file["ordernumber"],))
        connection.commit()
        return True

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")



