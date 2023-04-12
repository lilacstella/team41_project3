import json
import psycopg2
from datetime import date,datetime

def get_sales(date1, date2):
    connection = None
    try:
        connection = psycopg2.connect(user="csce315331_team_41_master",
                                      password="goldfishwithnuts",
                                      host="csce-315-db.engr.tamu.edu",
                                      database="csce315331_team_41")
        cursor = connection.cursor()
        date1str = date1
        date2str = date2
        query = query = """
    SELECT c.menuitem, ROUND(c.countitem * m.price, 2) AS totalsales
    FROM menu_t m
    INNER JOIN (
        SELECT menuitem, COUNT(menuitem) AS countitem
        FROM orderitem_t i
        INNER JOIN (
            SELECT ordernumber
            FROM order_history
            WHERE DATE(orderedat) >= %s AND DATE(orderedat) <= %s
        ) h ON h.ordernumber = i.ordernumber
        GROUP BY menuitem
    ) c ON m.menuitem = c.menuitem
"""
        params = (date1str, date2str)
        cursor.execute(query, params)
        results = cursor.fetchall()
        salesreportdict = {}
        salesreportlist = []
        total  = 0
        for row in results:
            salesreportlist.append({"itemname" : row[0], "itemsales": str(row[1])})
            total += row[1]
        salesreportdict["salesreport"] = salesreportlist
        salesreportdict["totalsales"] = str(total)
        return salesreportdict

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")

