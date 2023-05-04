"""
This is the main file for the Stone Point of Sale system.

It contains routes for handling menu, inventory, weather, sales, restock, and price-related requests.

Dependencies:
    - flask
    - flask_cors
    - stone

Routes:
    - /menu (GET/POST): Returns the menu or processes an order.
    - /inventory (GET/POST): Returns the current inventory or restocks items.
    - /weather (GET): Returns the weather forecast.
    - /whatsells (GET): Returns a report on what has been selling between two dates.
    - /xreport (GET): Returns the X report for the current day.
    - /zreport (GET/POST): Returns the Z report for the current day or posts the end of day inventory.
    - /salesreport (GET): Returns a report on sales between two dates.
    - /restockreport (GET): Returns a report on low inventory.
    - /excessreport (GET): Returns a report on excess inventory for a specific date.
    - /prices (GET/POST): Returns the current prices or adds/changes items in the menu or inventory.

Example Usage:
    python __main__.py

Note:
    - Debug mode is enabled for development purposes.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS

from stone import HOST_IP, HOST_PORT
from stone.employees import user_login
from stone.excess_report import get_excess
from stone.inventory import get_current_inventory, restock_all, restock_items
from stone.menu import get_menus, process_order
from stone.orderhistory import get_orders, remove_order
from stone.prices import get_prices, change_price, add_inv_item, add_menu_item, add_img
from stone.restock_report import get_low_inventory
from stone.sales_report import get_sales
from stone.weather import get_weather
from stone.what_sells import get_what_sells
from stone.x_report import get_xreport
from stone.z_report import get_zreport, post_eodinv

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://pizza-nr5v.onrender.com/", "http://localhost:3000"]}})

TOKEN_URI = 'https://oauth2.googleapis.com/token'


@app.route('/auth', methods=['POST'])
def auth():
    return jsonify(user_login(request.get_json()))


@app.route('/menu', methods=['GET', 'POST'])
def menu():
    """
    Returns the menu or processes an order.

    Returns:
        JSON: The menu if the request method is GET, or a success message if the request method is POST.
    """
    if request.method == 'GET':
        return jsonify(get_menus())
    elif request.method == 'POST':
        json_data = request.get_json()
        if json_data is None:
            return jsonify({"error": "Invalid JSON"})
        process_order(json_data)
        return jsonify({'success': True})


@app.route('/inventory', methods=['GET', 'POST'])
def inventory():
    """
    Returns the current inventory or restocks items.

    Returns:
        JSON: The current inventory if the request method is GET, or a success message if the request method is POST.
    """
    if request.method == 'GET':
        return jsonify(get_current_inventory())
    elif request.method == 'POST':
        json_data = request.get_json()
        if not json_data or json_data is None:
            restock_all()
            return jsonify({'success restockall': True})
        else:
            restock_items(request.get_json())
            return jsonify({'success restock': True})


@app.route('/weather', methods=['GET'])
def weather():
    """
    Endpoint to get the current weather.

    GET method:
        Returns the current weather as a JSON object.

    Returns:
        JSON object with the requested information.
    """
    if request.method == 'GET':
        return jsonify(get_weather())


@app.route('/whatsells', methods=['GET'])
def whatsells():
    """
    Endpoint to get what sells between two dates.

    GET method:
        Expects two query parameters:
            date1: The start date in YYYY-MM-DD format.
            date2: The end date in YYYY-MM-DD format.
        Returns what sold between those two dates as a JSON object.

    Returns:
        JSON object with the requested information.
    """
    if request.method == 'GET':
        date1 = request.args.get('date1')
        date2 = request.args.get('date2')
        return jsonify(get_what_sells(date1, date2))


@app.route('/xreport', methods=['GET'])
def xreport():
    """
    Route to get the x report data.

    Returns:
    - JSON data with x report data.
    """
    if request.method == 'GET':
        return jsonify(get_xreport())


@app.route('/zreport', methods=['GET', 'POST'])
def zreport():
    """
    Route to get the z report data or post end of day inventory.

    Returns:
    - JSON data with z report data if the method is GET.
    - JSON data with success message if the method is POST.
    """
    if request.method == 'GET':
        return jsonify(get_zreport())
    elif request.method == 'POST':
        if post_eodinv():
            return jsonify({'success': True})
        else:
            return jsonify({'success': False})


@app.route('/salesreport', methods=['GET'])
def salesreport():
    """
    Route to get the sales report data.

    Returns:
    - JSON data with sales report data.
    """
    if request.method == 'GET':
        date1 = request.args.get('date1')
        date2 = request.args.get('date2')
        return jsonify(get_sales(date1, date2))


@app.route('/restockreport', methods=['GET'])
def restockreport():
    """
    Route to get the restock report data.

    Returns:
    - JSON data with low inventory data.
    """
    if request.method == 'GET':
        return jsonify(get_low_inventory())


@app.route('/excessreport', methods=['GET'])
def excessreport():
    """
    Route to get the excess report data.

    Returns:
    - JSON data with excess report data.
    """
    if request.method == 'GET':
        date = request.args.get('date')
        return jsonify(get_excess(date))


@app.route('/prices', methods=['GET', 'POST'])
def prices():
    """
    Route to get or post the prices data.

    Returns:
    - JSON data with prices data if the method is GET.
    - JSON data with success message if the method is POST.
    """
    if request.method == 'GET':
        return jsonify(get_prices())
    elif request.method == 'POST':
        data = request.get_json()
        action = data.get("action", "")
        if action == "add_menu_item":
            result = add_menu_item(data)
        elif action == "add_inv_item":
            result = add_inv_item(data)
        elif action == "change_price":
            result = change_price(data)
        elif action == "add_image":
            result = add_img(data)
        else:
            result = False
        return jsonify({"success": result})


@app.route('/orderhistory', methods=['GET', 'POST'])
def orderhistory():
    if request.method == 'GET':
        date = request.args.get('date')
        print(date)
        return jsonify(get_orders(date))
    elif request.method == 'POST':
        if (remove_order(request.get_json())):
            return jsonify({'success': True})
        return jsonify({'success': False})


if __name__ == '__main__':
    app.run(debug=True, host=HOST_IP, port=HOST_PORT)
