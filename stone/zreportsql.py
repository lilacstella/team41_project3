import json
import psycopg2
from datetime import date

def get_zreport():
    connection = None
    try:
        connection = psycopg2.connect(user="csce315331_team_41_master",
                                      password="goldfishwithnuts",
                                      host="csce-315-db.engr.tamu.edu",
                                      database="csce315331_team_41")
        cursor = connection.cursor()
        todaysdate = date.today()
        todaystr = todaysdate.strftime("%Y-%m-%d")
        zreportquery = "select c.menuitem, c.countitem as quantity, ROUND(c.countitem * price, 2) as totalsales  from menu_t m inner join (select menuitem, count(menuitem) as countitem from orderitem_t i inner join(select ordernumber from order_history where date(orderedat)  = '" + todaystr  + "')h on h.ordernumber = i.ordernumber  group by menuitem) c on m.menuitem = c.menuitem"
        cursor.execute(zreportquery)
        zreporttable = cursor.fetchall()

        zreportdict = {}
        saleslist = []
        for row in zreporttable:
            salesdata = {"itemname" : row[0], "numbersold" : row[1], "sales": str(row[2])}
            saleslist.append(salesdata)
        zreportdict["salesdata"] = saleslist

        zreportpaymenttype = "select paymentform, sum(total) as totalsales from order_history where date(orderedat) = '" + todaystr +  "' group by paymentform;"
        cursor.execute(zreportpaymenttype)
        zreportpayment = cursor.fetchall()
        paymentlist = []
        total = 0
        for row in zreportpayment:
            total += row[1]
            paymentdata = {"paymenttype" : row[0], "sales": str(row[1])}
            paymentlist.append(paymentdata)
        zreportdict["paymentdata"] = paymentlist
        zreportdict["total"] = str(total)

        print(zreportdict)
        return zreportdict
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")

def post_eodinv():
    connection = None
    try:
        connection = psycopg2.connect(user="csce315331_team_41_master",
                                      password="goldfishwithnuts",
                                      host="csce-315-db.engr.tamu.edu",
                                      database="csce315331_team_41")
        cursor = connection.cursor()
        select_inv = "select inventoryitem, quantity,units from inventory_t"
        cursor.execute(select_inv)
        dailyinv = cursor.fetchall()

        insert_inv_history = "INSERT INTO inventory_history (date, inventory_item, quantity, units) VALUES (%s, %s, %s, %s)"
        current_date = date.today()
        for item in dailyinv:
            cursor.execute(insert_inv_history, (current_date, item[0], item[1], item[2]))

        connection.commit()
        
        return True
    except psycopg2.Error as e:
        return False
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")