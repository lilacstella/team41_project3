import psycopg2
import json

from stone import SQL_CREDS


def get_what_sells(date1, date2):
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
                "ORDER BY 3 DESC")
        start_date = date1
        end_date = date2
        cursor.execute(what_sells_query, (start_date, end_date))
        pairs = cursor.fetchall()
        pairs_list = []
        for row in pairs:
            pairsdata = {"Item 1": row[0],
                                "Item 2": row[1],
                                "Count": row[2],
                                }
            pairs_list.append(pairsdata)
        # Return as a JSON string
        return json.dumps(pairs_list)
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")


