"""
This module connects to a PostgreSQL database using the credentials stored in the 'SQL_CREDS' variable from the 'stone' module. 

Dependencies:
- psycopg2
- stone
- json

Functions:
- get_excess(datein)

Example usage:
    excess_report.get_excess('2022-04-25')
    '[{"ItemName": "Milk"}, {"ItemName": "Eggs"}]'
"""
import json

import psycopg2

from stone import SQL_CREDS


# returns inventory in JSON
def get_excess(datein):
    """
    Queries the database for inventory information and returns a JSON string
    representing all items whose current inventory is greater than 90% of their
    inventory from the specified date.

    Args:
        datein (str): A string representation of a date in YYYY-MM-DD format.

    Returns:
        str: A JSON string representing a list of items whose current inventory
        is greater than 90% of their inventory from the specified date. Each
        item is represented as a dictionary with a single key, "ItemName", whose
        value is the name of the item.

    Raises:
        psycopg2.Error: If there is an error connecting to the database or
        executing the query.

    """
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
        cursor = connection.cursor()
        datestr = datein
        datequery = ("SELECT date FROM inventory_history WHERE date <= %s ORDER BY date DESC LIMIT 1")
        cursor.execute(datequery, (datestr,))
        cursor_fetch = cursor.fetchone()
        if cursor_fetch is None:
            return '[]'
        date_return = cursor_fetch[0]

        print("Date: ", date_return)

        timeInventoryQuery = ("SELECT * FROM inventory_history WHERE date = %s")
        cursor.execute(timeInventoryQuery, (date_return,))
        pastInventory = cursor.fetchall()

        past_inventory_list = {}
        for row in pastInventory:
            past_inventory_list[row[1]] = float(row[2])

        currInventoryQuery = ("SELECT * FROM inventory_t")
        cursor.execute(currInventoryQuery)
        currInventory = cursor.fetchall()

        curr_inventory_list = {}
        for row in currInventory:
            curr_inventory_list[row[0]] = float(row[2])
        less_than_10 = []

        for item_name in past_inventory_list:
            past_quantity = past_inventory_list[item_name]
            if item_name in curr_inventory_list.keys():
                curr_quantity = curr_inventory_list[item_name]
                if curr_quantity > .9 * past_quantity:
                    less_than_10.append(item_name)
        return_dict = {'excessdata': [{"ItemName": x} for x in less_than_10]}
        return json.dumps(return_dict)

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
