"""
This module contains functions related to inventory management.

Dependencies:
    - json
    - psycopg2
    - stone

Functions:
    - get_current_inventory(): Returns the current inventory as a JSON string.
    - restock_all(): Restocks all items in the inventory to a quantity of 500.
    - restock_items(restock_json): Restocks the specified item to the specified quantity.

Example Usage:
import inventory
# get the current inventory
inventory_data = inventory.get_current_inventory()

# restock all items in the inventory
inventory.restock_all()

# restock a specific item
restock_data = {
    "InventoryItem": "Milk",
    "Quantity": "10"
}
inventory.restock_items(restock_data)

Note:
- The SQL credentials are obtained from the stone module.
"""
import json

import psycopg2

from stone import SQL_CREDS


# returns inventory in JSON
def get_current_inventory():
    """
    Retrieves the current inventory data from the database and returns it as a JSON string.

    Returns:
        str: A JSON string representing the current inventory data.
    """
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
        cursor = connection.cursor()
        select_inventory = "SELECT * FROM Inventory_t;"
        cursor.execute(select_inventory)
        inventory = cursor.fetchall()
        inventory_list = []
        for row in inventory:
            inventorydata = {"Inventory Item": row[0],
                             "Category": row[1],
                             "Quantity": float(row[2]),
                             "Units": row[3],
                             "Storage Location": row[4]}
            inventory_list.append(inventorydata)
        # Return as a JSON string
        return json.dumps(inventory_list)

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")


def restock_all():
    """
    Restocks all items in the inventory to a quantity of 500.

    Returns:
        None
    """
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
        cursor = connection.cursor()
        restock_inventory = "UPDATE Inventory_t SET Quantity = 500"
        cursor.execute(restock_inventory)
        connection.commit()
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")


def restock_items(restock_json):
    """
    Restocks a specific item in the inventory with the quantity specified in the input dictionary.

    Args:
        restock_json (dict): A dictionary containing the item to be restocked and the desired quantity.

    Returns:
        None
    """
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
        cursor = connection.cursor()
        restock_json_dict = restock_json
        # Update the inventory with the specified item and restock amount using a parameterized query
        restock_query = "UPDATE Inventory_t SET Quantity = %s WHERE InventoryItem = %s"
        inventory_tuple = (str(abs(int(restock_json_dict["Quantity"]))), restock_json_dict["InventoryItem"])
        cursor.execute(restock_query, inventory_tuple)
        connection.commit()
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
