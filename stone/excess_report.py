import json

import psycopg2

from stone import SQL_CREDS


# returns inventory in JSON
def get_excess(datein):
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
        cursor = connection.cursor()
        datestr = datein
        datequery = "SELECT date FROM inventory_history WHERE date <= %s ORDER BY date DESC LIMIT 1"
        cursor.execute(datequery, (datestr,))
        cursor_fetch = cursor.fetchone()
        if cursor_fetch is None:
            return '[]'
        date_return = cursor_fetch[0]

        print("Date: ", date_return)

        timeInventoryQuery = "SELECT * FROM inventory_history WHERE date = %s"
        cursor.execute(timeInventoryQuery, (date_return,))
        pastInventory = cursor.fetchall()

        past_inventory_list = {}
        for row in pastInventory:
            past_inventory_list[row[1]] = float(row[2])

        currInventoryQuery = "SELECT * FROM inventory_t"
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
