from datetime import datetime

import psycopg2

from stone import SQL_CREDS

"""
This module provides a function for generating a Z report from a PostgreSQL database.

Dependencies:
- datetime module
- psycopg2 module
- SQL_CREDS variable imported from the stone module

Example usage:

mydatabase.get_zreport()
{'salesdata': [{'itemname': 'item1', 'numbersold': 1, 'sales': '100.00'}, {'itemname': 'item2', 'numbersold': 2, 'sales': '200.00'}], 'paymentdata': [{'paymenttype': 'cash', 'sales': '300.00'}], 'total': '300.00'}

mydatabase.post_eodinv()
True


"""

def get_zreport():
    """
    Retrieves the daily sales and payment information from the database for generating a Z report.

    Returns:
        A dictionary containing the sales data and payment data for the day and the total sales for the day.

    Raises:
        None

    """
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
        cursor = connection.cursor()
        maxdatequery = "select max(date) from inventory_history;"
        cursor.execute(maxdatequery)
        maxdate = str(cursor.fetchone()[0])
        zreportquery = "select c.menuitem, c.countitem as quantity, ROUND(c.countitem * price, 2) as totalsales  from menu_t m inner join (select menuitem, count(menuitem) as countitem from orderitem_t i inner join(select ordernumber from order_history where orderedat  > '" + maxdate + "')h on h.ordernumber = i.ordernumber  group by menuitem) c on m.menuitem = c.menuitem"
        cursor.execute(zreportquery)
        zreporttable = cursor.fetchall()

        zreportdict = {}
        saleslist = []
        for row in zreporttable:
            salesdata = {"itemname": row[0], "numbersold": row[1], "sales": str(row[2])}
            saleslist.append(salesdata)
        zreportdict["salesdata"] = saleslist

        zreportpaymenttype = "select paymentform, sum(total) as totalsales from order_history where orderedat > '" + maxdate + "' group by paymentform;"
        cursor.execute(zreportpaymenttype)
        zreportpayment = cursor.fetchall()
        paymentlist = []
        total = 0
        for row in zreportpayment:
            total += row[1]
            paymentdata = {"paymenttype": row[0], "sales": str(row[1])}
            paymentlist.append(paymentdata)
        zreportdict["paymentdata"] = paymentlist
        zreportdict["total"] = str(total)

        return zreportdict
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")


def post_eodinv():
    """
    Retrieves the current inventory and adds it to the inventory history table for end-of-day record keeping.

    Returns:
        True if inventory history added successfully, False otherwise.

    Raises:
        psycopg2.Error: If an error occurs while adding the inventory history.

    """
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
        cursor = connection.cursor()
        select_inv = "select inventoryitem, quantity,units from inventory_t"
        cursor.execute(select_inv)
        dailyinv = cursor.fetchall()

        insert_inv_history = "INSERT INTO inventory_history (date, inventory_item, quantity, units) VALUES (%s, %s, %s, %s)"
        current_date = datetime.now()
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
