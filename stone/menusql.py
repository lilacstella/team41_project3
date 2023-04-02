import psycopg2
import json

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

        #put into json format
        employee_list = []
        for row in employee_table:
            fullname = " ".join([row[1],row[2]])
            employeedata = {"employeeid": row[0], "employee name": fullname, "manager": row[3]}
            employee_list.append(employeedata)

        # Return the list as a JSON string
        return json.dumps(employee_list)

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")

#returns as a dictionary, each entry has a list of the items for the query, run json.dumps(menu["itemname"]) to get in json form
def get_menus():
    connection = None
    try:
        connection = psycopg2.connect(user="csce315331_team_41_master",
                                       password="goldfishwithnuts",
                                       host="csce-315-db.engr.tamu.edu",
                                       database="csce315331_team_41")
        cursor = connection.cursor()
        menu_results = {}
        #add sauces 
        select_sauces = "SELECT InventoryItem FROM Inventory_t WHERE Category='Sauce'"
        cursor.execute(select_sauces)
        sauces = cursor.fetchall()
        sauces_list = []
        for row in sauces:
            saucesdata = {"saucename": row[0]}
            sauces_list.append(saucesdata)
        menu_results["sauces"] = sauces_list
        #add cheeses
        select_cheeses = "SELECT InventoryItem FROM Inventory_t WHERE Category='Cheese'"
        cursor.execute(select_cheeses)
        cheeses = cursor.fetchall()
        cheeses_list = []
        for row in cheeses:
            cheesedata = {"cheesename": row[0]}
            cheeses_list.append(cheesedata)
        menu_results["cheese"] = cheeses_list
        #add toppings 
        select_toppings = "SELECT InventoryItem FROM Inventory_t WHERE Category LIKE '%Topping%'"
        cursor.execute(select_toppings)
        toppings = cursor.fetchall()
        toppings_list = []
        for row in toppings:
            toppingdata = {"toppingname": row[0]}
            toppings_list.append(toppingdata)
        menu_results["toppings"] = toppings_list

        #add drizzles 
        select_drizzles = "SELECT InventoryItem FROM Inventory_t WHERE Category='Drizzle'"
        cursor.execute(select_drizzles)
        drizzles = cursor.fetchall()
        drizzles_list = []
        for row in drizzles:
            drizzledata = {"drizzlename": row[0]}
            drizzles_list.append(drizzledata)
        menu_results["drizzles"] = drizzles_list

        #add fountain drink prices 
        select_fountaindrink = "SELECT price FROM menu_t WHERE menuitem = 'Fountain Drink'"
        cursor.execute(select_fountaindrink)
        prices_list = cursor.fetchone()
        price = {"price": float(prices_list[0])}
        menu_results["fountaindrink"] = price


        # add all drinks
        select_drinks = "SELECT m.menuitem, m.price FROM menu_t m INNER JOIN inventory_t i ON m.menuitem = i.inventoryitem WHERE i.category = 'Drink';"
        cursor.execute(select_drinks)
        drinks = cursor.fetchall()
        menu_results["drinks"] = []
        for row in drinks:
            drinksdata = {"drinkname": row[0], "price": float(row[1])}
            menu_results["drinks"].append(drinksdata)

        # add all doughs
        select_doughs = "SELECT m.menuitem, m.price FROM menu_t m INNER JOIN inventory_t i ON m.menuitem = i.inventoryitem WHERE i.category = 'Dough'"
        cursor.execute(select_doughs)
        doughs = cursor.fetchall()
        menu_results["doughs"] = []
        for row in doughs:
            doughdata = {"doughname": row[0], "price": float(row[1])}
            menu_results["doughs"].append(doughdata)

        # add all seasonal items
        select_seasonal = "SELECT m.menuitem, m.price FROM menu_t m INNER JOIN inventory_t i ON m.menuitem = i.inventoryitem WHERE i.category = 'Seasonal'"
        cursor.execute(select_seasonal)
        seasonal = cursor.fetchall()
        menu_results["seasonal"] = []
        for row in seasonal:
            seasonaldata = {"seasonalname": row[0], "price": float(row[1])}
            menu_results["seasonal"].append(seasonaldata)
        
        #add all prices
        #cheese
        select_cheese_pizza = "SELECT price FROM menu_t WHERE menuitem = 'Original Cheese Pizza'"
        cursor.execute(select_cheese_pizza)
        cheesepizzaprice = cursor.fetchone()
        price = {"price": float(cheesepizzaprice[0])}
        menu_results["cheesepizzaprice"] = price

        #one topping
        select_one_topping_pizza = "SELECT price FROM menu_t WHERE menuitem = '1 Topping Pizza'"
        cursor.execute(select_one_topping_pizza)
        onetoppizzaprice = cursor.fetchone()
        price = {"price": float(onetoppizzaprice[0])}
        menu_results["onetoppingpizzaprice"] = price
        
        #4 topping
        select_multi_topping_pizza = "SELECT price FROM menu_t WHERE menuitem = '2-4 Topping Pizza'"
        cursor.execute(select_multi_topping_pizza)
        multitoppizzaprice = cursor.fetchone()
        price = {"price": float(multitoppizzaprice[0])}
        menu_results["multitoppingpizzaprice"] = price

        return menu_results

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")

#returns max line number in JSON
def get_max_line():
    connection = None
    try:
        connection = psycopg2.connect(user="csce315331_team_41_master",
                                       password="goldfishwithnuts",
                                       host="csce-315-db.engr.tamu.edu",
                                       database="csce315331_team_41")
        cursor = connection.cursor()
        select_max = "SELECT MAX(LineNumber) FROM OrderItem_T;"
        cursor.execute(select_max)
        result = cursor.fetchone()
        maxline = {"linenum": result[0]}
        # Return as a JSON string
        return json.dumps(maxline)

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")

#returns max order number in JSON
def get_max_order():
    connection = None
    try:
        connection = psycopg2.connect(user="csce315331_team_41_master",
                                       password="goldfishwithnuts",
                                       host="csce-315-db.engr.tamu.edu",
                                       database="csce315331_team_41")
        cursor = connection.cursor()
        select_max = "SELECT MAX(OrderNumber) FROM OrderItem_T;"
        cursor.execute(select_max)
        result = cursor.fetchone()
        maxorder = {"ordernum": result[0]}
        # Return as a JSON string
        return json.dumps(maxorder)

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")

