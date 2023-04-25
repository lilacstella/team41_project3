import json
from datetime import datetime

import psycopg2
from psycopg2 import sql

from stone import SQL_CREDS


def get_employees():
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
        cursor = connection.cursor()
        select_employees = "select * from employee_t"
        cursor.execute(select_employees)
        employee_table = cursor.fetchall()

        # put into json format
        employee_list = []
        for row in employee_table:
            fullname = " ".join([row[1], row[2]])
            employeedata = {"employeeid": row[0], "employee name": fullname, "manager": row[3]}
            employee_list.append(employeedata)

        # Return the list as a JSON string
        return json.dumps(employee_list)

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")


# returns as a dictionary, each entry has a list of the items for the query, run json.dumps(menu["itemname"]) to get
# in json form
def get_menus():
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
        cursor = connection.cursor()

        # get images
        select_img = "SELECT * FROM item_images"
        cursor.execute(select_img)
        img = cursor.fetchall()
        imgdict = {}
        for row in img:
            imgdict[row[0]] = row[1]

        menu_results = {}
        # add sauces
        select_sauces = "SELECT InventoryItem FROM Inventory_t WHERE Category='Sauce'"
        cursor.execute(select_sauces)
        sauces = cursor.fetchall()
        sauces_list = []
        for row in sauces:
            try:
                image = imgdict[row[0]]
            except KeyError:
                image = None
            saucesdata = {"sauce-name": row[0], "image": image}
            sauces_list.append(saucesdata)
        menu_results["sauce"] = sauces_list

        # add cheeses
        select_cheeses = "SELECT InventoryItem FROM Inventory_t WHERE Category='Cheese'"
        cursor.execute(select_cheeses)
        cheeses = cursor.fetchall()
        cheeses_list = []
        for row in cheeses:
            try:
                image = imgdict[row[0]]
            except KeyError:
                image = None
            cheesedata = {"cheese-name": row[0], "image": image}
            cheeses_list.append(cheesedata)
        menu_results["cheese"] = cheeses_list

        # add toppings
        select_toppings = "SELECT InventoryItem FROM Inventory_t WHERE Category LIKE '%Topping%'"
        cursor.execute(select_toppings)
        toppings = cursor.fetchall()
        toppings_list = []
        for row in toppings:
            try:
                image = imgdict[row[0]]
            except KeyError:
                image = None
            toppingdata = {"topping-name": row[0], "image": image}
            toppings_list.append(toppingdata)
        menu_results["topping"] = toppings_list

        # add drizzles
        select_drizzles = "SELECT InventoryItem FROM Inventory_t WHERE Category='Drizzle'"
        cursor.execute(select_drizzles)
        drizzles = cursor.fetchall()
        drizzles_list = []
        for row in drizzles:
            try:
                image = imgdict[row[0]]
            except KeyError:
                image = None
            drizzledata = {"drizzle-name": row[0], "image": image}
            drizzles_list.append(drizzledata)
        menu_results["drizzle"] = drizzles_list

        # add fountain drink prices
        select_fountaindrink = "SELECT price FROM menu_t WHERE menuitem = 'Fountain Drink'"
        cursor.execute(select_fountaindrink)
        prices_list = cursor.fetchone()
        try:
            image = imgdict["Fountain Drink"]
        except KeyError:
            image = None
        fountain_data = {"drink-name": "Fountain Drink", "price": float(prices_list[0]), "image": image}

        # add all drinks
        select_drinks = "SELECT m.menuitem, m.price FROM menu_t m INNER JOIN inventory_t i ON m.menuitem = i.inventoryitem WHERE i.category = 'Drink';"
        cursor.execute(select_drinks)
        drinks = cursor.fetchall()
        menu_results["drink"] = []
        for row in drinks:
            try:
                image = imgdict[row[0]]
            except KeyError:
                image = None
            drinksdata = {"drink-name": row[0], "price": float(row[1]), "image": image}
            menu_results["drink"].append(drinksdata)
        menu_results["drink"].append(fountain_data)

        # add all doughs
        select_doughs = "SELECT m.menuitem, m.price FROM menu_t m INNER JOIN inventory_t i ON m.menuitem = i.inventoryitem WHERE i.category = 'Dough'"
        cursor.execute(select_doughs)
        doughs = cursor.fetchall()
        menu_results["dough"] = []
        for row in doughs:
            try:
                image = imgdict[row[0]]
            except KeyError:
                image = None
            doughdata = {"dough-name": row[0], "price": float(row[1]), "image": image}
            menu_results["dough"].append(doughdata)

        # add all seasonal items
        select_seasonal = "SELECT m.menuitem, m.price FROM menu_t m INNER JOIN inventory_t i ON m.menuitem = i.inventoryitem WHERE i.category = 'Seasonal'"
        cursor.execute(select_seasonal)
        seasonal = cursor.fetchall()
        menu_results["seasonal"] = []
        for row in seasonal:
            try:
                image = imgdict[row[0]]
            except KeyError:
                image = None
            seasonaldata = {"seasonal-name": row[0], "price": float(row[1]), "image": image}
            menu_results["seasonal"].append(seasonaldata)

        # add all prices
        # cheese
        select_cheese_pizza = "SELECT price FROM menu_t WHERE menuitem = 'Original Cheese Pizza'"
        cursor.execute(select_cheese_pizza)
        cheesepizzaprice = cursor.fetchone()
        try:
            image = imgdict["Original Cheese Pizza"]
        except KeyError:
            image = None
        price = {"price": float(cheesepizzaprice[0]), "image": image}
        menu_results["cheese-pizza-price"] = price

        # one topping
        select_one_topping_pizza = "SELECT price FROM menu_t WHERE menuitem = '1 Topping Pizza'"
        cursor.execute(select_one_topping_pizza)
        onetoppizzaprice = cursor.fetchone()
        try:
            image = imgdict["1 Topping Pizza"]
        except KeyError:
            image = None
        price = {"price": float(onetoppizzaprice[0]), "image": image}
        menu_results["one-topping-pizza-price"] = price

        # 4 topping
        select_multi_topping_pizza = "SELECT price FROM menu_t WHERE menuitem = '2-4 Topping Pizza'"
        cursor.execute(select_multi_topping_pizza)
        multitoppizzaprice = cursor.fetchone()
        try:
            image = imgdict["2-4 Topping Pizza"]
        except KeyError:
            image = None
        price = {"price": float(multitoppizzaprice[0]), "image": image}
        menu_results["multi-topping-pizza-price"] = price

        return menu_results

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")


# order json passed as list of orderitem dicts
def process_order(json_data):
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
        cursor = connection.cursor()
        # array of strings and dictionaries, dictionary if it's a pizza
        order_items = json_data["order"]

        # max line number
        select_max_line = "SELECT MAX(LineNumber) FROM OrderItem_T;"
        cursor.execute(select_max_line)
        max_line_num = cursor.fetchone()[0]

        # max order number
        select_max_order = "SELECT MAX(OrderNumber) FROM order_history;"
        cursor.execute(select_max_order)
        max_order_num = cursor.fetchone()[0]
        max_order_num += 1

        # Cookie
        # Baja Blast
        # {'topping': ['Tomatoes', 'Mushrooms', 'Salami', 'Jalapeño'], 'sauce': 'Alfredo', 'cheese': 'Mozzarella', 'drizzle': 'Olive Oil'}
        order_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        employee_id = json_data["employee_id"]
        payment_form = json_data["payment_form"]
        total_cost = 0
        for order_item in order_items:
            # price computation for order history
            item_on_menu = order_item
            if type(order_item) == dict:
                if len(order_item['topping']) > 1:
                    item_on_menu = "2-4 Topping Pizza"
                elif len(order_item['topping']) == 1:
                    item_on_menu = "1 Topping Pizza"
                else:
                    item_on_menu = "Original Cheese Pizza"

            cursor.execute("SELECT price FROM menu_t WHERE menuitem = %s", (item_on_menu,))
            total_cost += cursor.fetchone()[0]

        # update orderhistory
        order_history_query = "INSERT INTO order_history VALUES (%s, %s, %s, %s, %s)"
        order_history_tuple = (max_order_num, total_cost, payment_form, order_time, employee_id)
        print(total_cost)
        cursor.execute(order_history_query, order_history_tuple)
        connection.commit()

        for order_item in order_items:
            # individual items in order item history and inventory
            max_line_num += 1
            item_on_menu = order_item
            if type(order_item) == dict:
                if len(order_item['topping']) > 1:
                    item_on_menu = "2-4 Topping Pizza"
                elif len(order_item['topping']) == 1:
                    item_on_menu = "1 Topping Pizza"
                else:
                    item_on_menu = "Original Cheese Pizza"
            cursor.execute("INSERT INTO orderitem_t (linenumber, ordernumber, menuitem) VALUES (%s, %s, %s)",
                           (max_line_num, max_order_num, item_on_menu))
            if type(order_item) == dict:
                for key, val in order_item.items():
                    if key == 'topping':
                        for index, topping in enumerate(val):
                            cursor.execute(
                                sql.SQL("UPDATE orderitem_t SET {} = %s WHERE linenumber = %s")
                                .format(sql.Identifier(f"topping{index + 1}"))
                                , (topping, max_line_num))
                            cursor.execute("UPDATE inventory_t SET Quantity = Quantity - 1 WHERE inventoryitem = %s",
                                           (topping,))
                    else:
                        cursor.execute(
                            sql.SQL("UPDATE orderitem_t SET {} = %s WHERE linenumber = %s")
                            .format(sql.Identifier(key))
                            , (val, max_line_num))
                        cursor.execute("UPDATE inventory_t SET Quantity = Quantity - 1 WHERE inventoryitem = %s",
                                       (val,))

                # skip following non pizza inventory tracking
                connection.commit()
                continue

            elif order_item == "Fountain Drink":
                cursor.execute("UPDATE inventory_t SET Quantity = Quantity - 1 WHERE inventoryitem = 'Cups';")
            else:
                cursor.execute("UPDATE inventory_t SET Quantity = Quantity - 1 WHERE inventoryitem = %s;",
                               (order_item,))

            connection.commit()
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
