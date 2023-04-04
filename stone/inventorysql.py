import psycopg2
import json

#returns inventory in JSON
def get_current_inventory():
    connection = None
    try:
        connection = psycopg2.connect(user="csce315331_team_41_master",
                                       password="goldfishwithnuts",
                                       host="csce-315-db.engr.tamu.edu",
                                       database="csce315331_team_41")
        cursor = connection.cursor()
        select_inventory = "SELECT * FROM Inventory_t;"
        cursor.execute(select_inventory)
        inventory = cursor.fetchall()
        inventory_list = []
        for row in inventory:
            inventorydata = {"InventoryItem": row[0], 
                                "Category": row[1], 
                                "Quantity": row[2], 
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

def restock_all():
    connection = None
    try:
        connection = psycopg2.connect(user="csce315331_team_41_master",
                                       password="goldfishwithnuts",
                                       host="csce-315-db.engr.tamu.edu",
                                       database="csce315331_team_41")
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
    connection = None
    try:
        connection = psycopg2.connect(user="csce315331_team_41_master",
                                       password="goldfishwithnuts",
                                       host="csce-315-db.engr.tamu.edu",
                                       database="csce315331_team_41")
        cursor = connection.cursor()
        restock_json_dict = json.loads(restock_json)
        # Update the inventory with the specified item and restock amount using a parameterized query
        restock_query = "UPDATE Inventory_t SET Quantity = %s WHERE InventoryItem = %s"
        for item_data in restock_json_dict:
            inventory_item = item_data['InventoryItem']
            restock_amount = item_data['Quantity']
            cursor.execute(restock_query, (restock_amount, inventory_item))
            connection.commit()
            
    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
