import psycopg2
import json

from stone import SQL_CREDS

"""
This module provides functions to retrieve data from a PostgreSQL database and return it as a JSON string. The module depends on the psycopg2 and json modules, as well as the SQL_CREDS credentials and WEATHER_API_KEY key provided in the stone module.

Functions:
- get_what_sells(date1, date2)
- get_weather()

Example usage:

mydatabase.get_what_sells("2020-01-01", "2020-01-31")
[{"item1": "item1", "item2": "item2", "order_count": 1}, {"item1": "item1", "item2": "item3", "order_count": 1}, {"item1": "item2", "item2": "item3", "order_count": 1}]
"""

def get_what_sells(date1, date2):
    """
    Returns pairs of menu items that have been ordered together within the specified date range.

    Args:
    - date1 (str): Start date of the date range in "YYYY-MM-DD" format.
    - date2 (str): End date of the date range in "YYYY-MM-DD" format.
    
    Returns:
    (str): JSON-encoded list of dictionaries containing item pairs and the count of orders in which they were ordered together.
    """
    connection = None
    try:
        connection = psycopg2.connect(**SQL_CREDS)
        cursor = connection.cursor()
        # Update the inventory with the specified item and restock amount using a parameterized query
        what_sells_query = ("SELECT li1.MenuItem AS item1, li2.MenuItem AS item2, COUNT(DISTINCT o.OrderNumber) AS order_count\n" +
                "FROM OrderItem_T li1\n" +
                "INNER JOIN OrderItem_T li2 ON li1.OrderNumber = li2.OrderNumber AND li1.MenuItem < li2.MenuItem\n" +
                "INNER JOIN Order_History o ON li1.OrderNumber = o.OrderNumber AND date(o.orderedat) >= %s AND date(o.orderedat) <= %s\n" +
                "GROUP BY li1.MenuItem, li2.MenuItem HAVING COUNT(DISTINCT o.OrderNumber) >= 1\n" +
                "ORDER BY 3 DESC");
        start_date = date1
        end_date = date2
        print(start_date)
        print(end_date)
        cursor.execute(what_sells_query, (start_date, end_date))
        pairs = cursor.fetchall()
        pairs_list = []
        for row in pairs:
            pairsdata = {"item1": row[0], 
                                "item2": row[1], 
                                "count": row[2], 
                                }
            pairs_list.append(pairsdata)
        # Return as a JSON string
        return json.dumps(pairs_list)
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")


