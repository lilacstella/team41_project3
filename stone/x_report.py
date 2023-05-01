from datetime import date

import psycopg2

from stone import SQL_CREDS

"""
This module provides a function for generating an X report from a PostgreSQL database.

Dependencies:
    - psycopg2
    - stone.SQL_CREDS

Example usage:
    get_xreport()
    {'salesdata': [{'itemname': 'item1', 'numbersold': 1, 'sales': '100.00'}, {'itemname': 'item2', 'numbersold': 2, 'sales': '200.00'}], 'paymentdata': [{'paymenttype': 'cash', 'totalsales': '300.00'}], 'total': '300.00'}

"""

def get_xreport():
    """
    Retrieve data from a PostgreSQL database and format it into a dictionary with sales data, payment data, and a total.

    Returns:
        A dictionary containing sales data, payment data, and a total.
    """
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
        cursor = connection.cursor()
        todaysdate = date.today()
        todaystr = todaysdate.strftime("%Y-%m-%d")

        xreportquery = "select c.menuitem, c.countitem as quantity, ROUND(c.countitem * price, 2) as totalsales  from menu_t m inner join (select menuitem, count(menuitem) as countitem from orderitem_t i inner join(select ordernumber from order_history where date(orderedat)  = '" + todaystr + "')h on h.ordernumber = i.ordernumber  group by menuitem) c on m.menuitem = c.menuitem"
        cursor.execute(xreportquery)
        xreporttable = cursor.fetchall()

        xreportdict = {}
        saleslist = []
        for row in xreporttable:
            salesdata = {"itemname": row[0], "numbersold": row[1], "sales": str(row[2])}
            saleslist.append(salesdata)
        xreportdict["salesdata"] = saleslist

        xreportpaymenttype = "select paymentform, sum(total) as totalsales from order_history where date(orderedat) = '" + todaystr + "' group by paymentform;"
        cursor.execute(xreportpaymenttype)
        xreportpayment = cursor.fetchall()
        paymentlist = []
        total = 0
        for row in xreportpayment:
            total += row[1]
            paymentdata = {"paymenttype": row[0], "sales": str(row[1])}
            paymentlist.append(paymentdata)
        xreportdict["paymentdata"] = paymentlist
        xreportdict["total"] = str(total)

        print(xreportdict)
        return xreportdict
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
