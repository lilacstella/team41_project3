import psycopg2

from stone import SQL_CREDS

"""
This module provides functions to retrieve sales and inventory data from a PostgreSQL database.

Dependencies:
- psycopg2
- stone (SQL_CREDS constant)

Functions:
- get_sales(date1, date2)

Example Usage:

mydatabase.get_sales("2020-01-01", "2020-01-31")
{'salesreport': [{'itemname': 'item1', 'itemsales': '100.00'}, {'itemname': 'item2', 'itemsales': '200.00'}], 'totalsales': '300.00'}

"""
def get_sales(date1, date2):
    """
    Retrieves sales report data from the database for a specified date range.

    Args:
    - date1 (str): A string representing the start date for the sales report (formatted as "YYYY-MM-DD").
    - date2 (str): A string representing the end date for the sales report (formatted as "YYYY-MM-DD").
    
    Returns:
    A dictionary with two keys:
    - "salesreport": A list of dictionaries, where each dictionary contains an item name and its total sales within the date range.
    - "totalsales": A string representing the total sales for all items within the date range.
    """
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
        cursor = connection.cursor()
        date1str = date1
        date2str = date2
        query = """
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
        total = 0
        for row in results:
            salesreportlist.append({"itemname": row[0], "itemsales": str(row[1])})
            total += row[1]
        salesreportdict["salesreport"] = salesreportlist
        salesreportdict["totalsales"] = str(total)
        return salesreportdict

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
