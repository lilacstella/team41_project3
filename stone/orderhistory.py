import psycopg2
import json

from stone import SQL_CREDS


def get_orders(date):
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



