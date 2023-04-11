import psycopg2
import json

def get_what_sells(what_sells_json): 
    connection = None
    try:
        connection = psycopg2.connect(user="csce315331_team_41_master",
                                       password="goldfishwithnuts",
                                       host="csce-315-db.engr.tamu.edu",
                                       database="csce315331_team_41")
        cursor = connection.cursor()
        what_sells_json_dict = what_sells_json
        # Update the inventory with the specified item and restock amount using a parameterized query
        what_sells_query = ("SELECT li1.MenuItem AS item1, li2.MenuItem AS item2, COUNT(DISTINCT o.OrderNumber) AS order_count\n" +
                "FROM OrderItem_T li1\n" +
                "INNER JOIN OrderItem_T li2 ON li1.OrderNumber = li2.OrderNumber AND li1.MenuItem < li2.MenuItem\n" +
                "INNER JOIN Order_History o ON li1.OrderNumber = o.OrderNumber AND date(o.orderedat) >= %s AND date(o.orderedat) <= %s\n" +
                "GROUP BY li1.MenuItem, li2.MenuItem HAVING COUNT(DISTINCT o.OrderNumber) >= 1\n" +
                "ORDER BY 3 DESC");
        start_date = what_sells_json_dict['start-date']
        end_date = what_sells_json_dict['end-date']
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


