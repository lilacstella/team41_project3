import json
import psycopg2

def get_prices():
    connection = None
    try:
        connection = psycopg2.connect(user="csce315331_team_41_master",
                                      password="goldfishwithnuts",
                                      host="csce-315-db.engr.tamu.edu",
                                      database="csce315331_team_41")
        cursor = connection.cursor()

        prices_dict = {}
        select_menu = "select * from menu_t"
        cursor.execute(select_menu)
        menu = cursor.fetchall()
        menulist = []
        for row in menu:
            menuitemdict = {"menu_item_name": row[0], "current_price": str(row[1])}
            menulist.append(menuitemdict)
        prices_dict["menuitems"] = menulist

        select_category = "select distinct category from inventory_t"
        cursor.execute(select_category)
        categories = cursor.fetchall()
        categorieslist = []
        for row in categories:
            categorieslist.append(row[0])
        prices_dict["categories"] = categorieslist
        if("Seasonal" not in categorieslist):
            categorieslist.append("Seasonal")

        select_storageloc = "select distinct storagelocation from inventory_t"
        cursor.execute(select_storageloc)
        storage = cursor.fetchall()
        storagelist = []
        for row in storage:
            storagelist.append(row[0])
        prices_dict["storage"] = storagelist

        return prices_dict
    
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")

def add_menu_item(json_file):
    connection = None
    try:
        connection = psycopg2.connect(user="csce315331_team_41_master",
                                      password="goldfishwithnuts",
                                      host="csce-315-db.engr.tamu.edu",
                                      database="csce315331_team_41")
        cursor = connection.cursor()

        add_item = "INSERT INTO menu_t VALUES (%s, %s);"
        menu_tuple = (json_file["menuitem"], json_file["price"])
        cursor.execute(add_item, menu_tuple)
        connection.commit()
        return True  
    
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")

def add_inv_item(json_file):
    connection = None
    try:
        connection = psycopg2.connect(user="csce315331_team_41_master",
                                      password="goldfishwithnuts",
                                      host="csce-315-db.engr.tamu.edu",
                                      database="csce315331_team_41")
        cursor = connection.cursor()
        add_item = "INSERT INTO inventory_t VALUES (%s, %s, %d, %s, %s);"
        menu_tuple = (json_file["inventoryitem"], json_file["category"], json_file["quantity"], json_file["units"], json_file["storagelocation"] )
        cursor.execute(add_item, menu_tuple)
        connection.commit()
        return True
    
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")

def change_price(json_file):
    connection = None
    try:
        connection = psycopg2.connect(user="csce315331_team_41_master",
                                      password="goldfishwithnuts",
                                      host="csce-315-db.engr.tamu.edu",
                                      database="csce315331_team_41")
        cursor = connection.cursor()
        change_proce = "UPDATE menu_t SET price = %d WHERE menuitem = %s"
        price_tuple = (json_file["price"], json_file["menuitem"])
        cursor.execute(change_price, price_tuple)
        connection.commit()
        return True
    
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")