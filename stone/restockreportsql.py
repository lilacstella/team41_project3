import psycopg2
import json

#returns inventory in JSON
def get_low_inventory():
    connection = None
    try:
        connection = psycopg2.connect(user="csce315331_team_41_master",
                                       password="goldfishwithnuts",
                                       host="csce-315-db.engr.tamu.edu",
                                       database="csce315331_team_41")
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
