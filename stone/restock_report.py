import json

import psycopg2

from stone import SQL_CREDS

"""
This module provides functions to interact with a PostgreSQL database using psycopg2 library. It requires the SQL_CREDS module to store the credentials to access the database.

Dependencies:
- psycopg2
- json
- stone.SQL_CREDS

Functions:
- get_low_inventory(): Returns inventory items with quantity less than or equal to 10 in JSON format.

Example Usage:

mydatabase.get_low_inventory()
'[{"InventoryItem": "item1", "Category": "category1", "Quantity": 5.0, "Units": "unit1", "StorageLocation": "location1"}]'

"""

# returns inventory in JSON
def get_low_inventory():
    """
    Returns inventory items with quantity less than or equal to 10 in JSON format.

    Args:
    None

    Returns:
    - str: A JSON string representing the inventory items with quantity less than or equal to 10.
    """
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
        cursor = connection.cursor()
        select_inventory = "SELECT * FROM Inventory_t WHERE Quantity <= 10"
        cursor.execute(select_inventory)
        inventory = cursor.fetchall()
        inventory_list = []
        for row in inventory:
            inventorydata = {"InventoryItem": row[0],
                             "Category": row[1],
                             "Quantity": float(row[2]),
                             "Units": row[3],
                             "StorageLocation": row[4]}
            inventory_list.append(inventorydata)
        # Return as a JSON string
        return json.dumps(inventory_list)

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
