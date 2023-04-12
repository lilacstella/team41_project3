import json

import psycopg2


# for later login stuff????
def get_employees():
    connection = None
    try:
        connection = psycopg2.connect(user="csce315331_team_41_master",
                                      password="goldfishwithnuts",
                                      host="csce-315-db.engr.tamu.edu",
                                      database="csce315331_team_41")
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


# returns as a dictionary, each entry has a list of the items for the query, run json.dumps(menu["itemname"]) to get in json form
def get_menus():
    connection = None
    try:
        connection = psycopg2.connect(user="csce315331_team_41_master",
                                      password="goldfishwithnuts",
                                      host="csce-315-db.engr.tamu.edu",
                                      database="csce315331_team_41")
        cursor = connection.cursor()

        #get images
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
            saucesdata = {"sauce-name": row[0], "image" :image}
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
            cheesedata = {"cheese-name": row[0], "image" : image}
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
            image = imgdict[prices_list[0]]
        except KeyError:
            image = None
        price = {"price": float(prices_list[0]), "image": image}
        menu_results["fountain-drink"] = price

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
def process_order(json_file):
    connection = None
    try:
        connection = psycopg2.connect(user="csce315331_team_41_master",
                                      password="goldfishwithnuts",
                                      host="csce-315-db.engr.tamu.edu",
                                      database="csce315331_team_41")
        cursor = connection.cursor()
        order_dict = json_file  # not sure why it doesn't need to load json??? but it works??

        # max line number
        select_max_line = "SELECT MAX(LineNumber) FROM OrderItem_T;"
        cursor.execute(select_max_line)
        maxline = cursor.fetchone()[0]
        maxline += 1

        # max order number
        select_max_order = "SELECT MAX(OrderNumber) FROM order_history;"
        cursor.execute(select_max_order)
        maxorder = cursor.fetchone()[0]
        maxorder += 1

        # update orderhistory
        order_history_info = order_dict["orderhistory"]
        order_history_query = "INSERT INTO order_history VALUES (%s, %s, %s, %s, %s);"
        order_history_tuple = (
            str(maxorder), order_history_info["total"], order_history_info["paymentform"],
            order_history_info["orderedat"], order_history_info["employeeid"])
        cursor.execute(order_history_query, order_history_tuple)
        connection.commit()

        

        for item in order_dict["orderitems"]:
            # add item to orderitem
            query = "INSERT INTO orderitem_t VALUES (%s, %s, %s, %s, %s, %s,%s, %s, %s, %s);"
            itemtuple = (
                str(maxline), str(maxorder), item["itemname"], item["sauce"], item["cheese"],
                item["topping1"],
                item["topping2"], item["topping3"], item["topping4"], item["drizzle"])
            cursor.execute(query, itemtuple)
            # remove stuff from inventory
            # pizza
            if (item["itemname"] == "1 Topping Pizza" or item["itemname"] == "Original Cheese Pizza" or
                    item["itemname"] == "2-4 Topping Pizza"):

                # doughs
                updatedough = "UPDATE inventory_t SET Quantity = Quantity - 1 WHERE inventoryitem = %s"
                doughtuple = (item["dough"],)
                cursor.execute(updatedough, doughtuple)
                # boxes
                updatebox = "UPDATE inventory_t SET Quantity = Quantity - 1 WHERE inventoryitem = 'Carboard Boxes';"
                cursor.execute(updatebox)
                # sauce
                updatesauce = "UPDATE inventory_t SET Quantity = Quantity - 1 WHERE inventoryitem = %s;"
                saucetuple = (item["sauce"],)
                cursor.execute(updatesauce, saucetuple)
                # cheese
                updatecheese = "UPDATE inventory_t SET Quantity = Quantity - 1 WHERE inventoryitem = %s;"
                cheesetuple = (item["cheese"],)
                cursor.execute(updatecheese, cheesetuple)
                # drizzle
                updatedrizzle = "UPDATE inventory_t SET Quantity = Quantity - 1 WHERE inventoryitem = %s;"
                drizzletuple = (item["drizzle"],)
                cursor.execute(updatedrizzle, drizzletuple)
                # toppings
                updatetopping1 = "UPDATE inventory_t SET Quantity = Quantity - 1 WHERE inventoryitem = %s"
                toppingtuple1 = (item["topping1"],)
                cursor.execute(updatetopping1, toppingtuple1)
                updatetopping2 = "UPDATE inventory_t SET Quantity = Quantity - 1 WHERE inventoryitem = %s"
                toppingtuple2 = (item["topping2"],)
                cursor.execute(updatetopping2, toppingtuple2)
                updatetopping3 = "UPDATE inventory_t SET Quantity = Quantity - 1 WHERE inventoryitem = %s"
                toppingtuple3 = (item["topping3"],)
                cursor.execute(updatetopping3, toppingtuple3)
                updatetopping4 = "UPDATE inventory_t SET Quantity = Quantity - 1 WHERE inventoryitem = %s"
                toppingtuple4 = (item["topping4"],)
                cursor.execute(updatetopping4, toppingtuple4)
            # fountain drink
            elif (item["itemname"] == "Fountain Drink"):
                updatecups = "UPDATE inventory_t SET Quantity = Quantity - 1 WHERE inventoryitem = 'Cups';"
                cursor.execute(updatecups)
            # drink
            else:
                updateinvother = "UPDATE inventory_t SET Quantity = Quantity - 1 WHERE inventoryitem = %s;"
                othertuple = (item["itemname"],)
                cursor.execute(updateinvother, othertuple)

            connection.commit()
            maxline += 1
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
