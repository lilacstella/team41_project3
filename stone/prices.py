"""
This module provides functions to interact with a PostgreSQL database containing menu and inventory information for a restaurant.

Dependencies:
- psycopg2: PostgreSQL adapter for Python

Functions:
- get_prices(): Retrieve prices of menu items, categories, storage locations, and items without images.
- add_menu_item(json_file): Add a menu item and its price to the database.
- add_inv_item(json_file): Add an inventory item and its details to the database.
- change_price(json_file): Change the price of a menu item in the database.
- add_img(json_file): Add or update the image URL for a menu item in the database.

Example usage:

Retrieve prices
prices = restaurant_db.get_prices()
print(prices)

Add a menu item
menu_item = {"menuitem": "Pepperoni Pizza", "price": 12.99}
added = restaurant_db.add_menu_item(json.dumps(menu_item))
print(added)

Add an inventory item
inv_item = {"inventoryitem": "Pepperoni", "category": "Topping-Meat", "quantity": 10, "units": "oz", "storagelocation": "Fridge"}
added = restaurant_db.add_inv_item(json.dumps(inv_item))
print(added)

Change the price of a menu item
new_price = {"menuitem": "Pepperoni Pizza", "price": 13.99}
changed = restaurant_db.change_price(json.dumps(new_price))
print(changed)

Add or update the image URL for a menu item
img_info = {"item_name": "Pepperoni Pizza", "img_url": "https://example.com/pepperoni.jpg"}
added_or_updated = restaurant_db.add_img(json.dumps(img_info))
print(added_or_updated)
"""

import psycopg2

from stone import SQL_CREDS

def get_prices():
    """
    Retrieve prices of menu items, categories, storage locations, and items without images.

    Returns:
    A dictionary containing the following keys:
        - menuitems: a list of dictionaries, each representing a menu item and its current price.
        - categories: a list of strings, each representing a category of inventory items.
        - storage: a list of strings, each representing a storage location for inventory items.
        - no-img: a list of strings, each representing an inventory item that does not have an image in the database.
    """
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
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
        if ("Seasonal" not in categorieslist):
            categorieslist.append("Seasonal")

        select_storageloc = "select distinct storagelocation from inventory_t"
        cursor.execute(select_storageloc)
        storage = cursor.fetchall()
        storagelist = []
        for row in storage:
            storagelist.append(row[0])
        prices_dict["storage"] = storagelist

        get_no_img = """select distinct t.item from 
        (select inventoryitem as item from inventory_t where category IN ('Topping-Meat', 'Topping-Veggies', 'Seasonal', 'Sauce', 'Drizzle', 'Drink', 'Dough', 'Cheese') and inventoryitem not in ('Regular Dough')
        ) t left join item_images i on t.item = i.item_name
        where i.item_name is NULL"""
        cursor.execute(get_no_img)
        no_img_items = [row[0] for row in cursor.fetchall()]
        prices_dict["no-img"] = no_img_items

        return prices_dict

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")


def add_menu_item(json_file):
    """
    Adds a new menu item to the database.

    Args:
    - json_file: a dictionary containing the menu item and its price.

    Returns:
    - True if the insertion is successful.
    """
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
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
    """
    Adds a new inventory item to the database.

    Args:
    - json_file: a dictionary containing the inventory item, its category, quantity, units and storage location.

    Returns:
    - True if the insertion is successful.
    """
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
        cursor = connection.cursor()
        add_item = "INSERT INTO inventory_t VALUES (%s, %s, %s, %s, %s);"
        menu_tuple = (json_file["inventoryitem"], json_file["category"], json_file["quantity"], json_file["units"],
                      json_file["storagelocation"])
        cursor.execute(add_item, menu_tuple)
        connection.commit()
        return True

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")


def change_price(json_file):
    """
    Changes the price of a menu item.

    Args:
    - json_file: a dictionary containing the menu item and its new price.

    Returns:
    - True if the update is successful.
    """
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
        cursor = connection.cursor()
        price_tuple = (json_file["price"], json_file["menuitem"])
        cursor.execute("UPDATE menu_t SET price = %s WHERE menuitem = %s", price_tuple)
        connection.commit()
        return True

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")


def add_img(json_file):
    """
    Adds or updates an image URL for an item in the database.

    Args:
    - json_file: a dictionary containing the item name and its image URL.

    Returns:
    - True if the insertion/update is successful.
    """
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
        cursor = connection.cursor()
        checkforimage = "SELECT * FROM item_images where item_name = %s"
        checktuple = (json_file["item_name"],)
        print(json_file["img_url"])
        cursor.execute(checkforimage, checktuple)
        results = cursor.fetchall()
        if (results == []):
            img_tuple = (json_file["item_name"], json_file["img_url"])
            cursor.execute("INSERT INTO item_images VALUES (%s, %s)", img_tuple)
            connection.commit()
        else:
            update_img = "UPDATE item_images SET img_url = %s WHERE item_name = %s"
            update_tuple = (json_file["img_url"], json_file["item_name"])
            cursor.execute(update_img, update_tuple)
            connection.commit()

        return True

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
