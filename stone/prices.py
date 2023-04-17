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

        print(prices_dict)
    
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")

get_prices()