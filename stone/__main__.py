from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from stone import ORIGIN, HOST_IP, HOST_PORT
from stone.excess_report import get_excess
from stone.inventory import get_current_inventory, restock_all, restock_items
from stone.menu import get_menus, process_order
from stone.prices import get_prices, change_price, add_inv_item, add_menu_item, add_img
from stone.restock_report import get_low_inventory
from stone.sales_report import get_sales
from stone.weather import get_weather
from stone.what_sells import get_what_sells
from stone.x_report import get_xreport
from stone.z_report import get_zreport, post_eodinv
from stone.orderhistory import get_orders, remove_order


app = Flask(__name__)
cors = CORS(app)


@app.route('/menu', methods=['GET', 'POST'])
# @cross_origin(origins=ORIGIN, methods=["GET", "POST"])
def menu():
    if request.method == 'GET':
        return jsonify(get_menus())
    elif request.method == 'POST':
        json_data = request.get_json()
        if json_data is None:
            return jsonify({"error": "Invalid JSON"})
        process_order(json_data)
        return jsonify({'success': True})


@app.route('/inventory', methods=['GET', 'POST'])
# @cross_origin(origins=ORIGIN, methods=["GET", "POST"])
def inventory():
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
# @cross_origin(origins=ORIGIN, methods=["GET"])
def weather():
    if request.method == 'GET':
        return jsonify(get_weather())


@app.route('/whatsells', methods=['GET'])
# @cross_origin(origins=ORIGIN, methods=["GET"])
def whatsells():
    if request.method == 'GET':
        date1 = request.args.get('date1')
        date2 = request.args.get('date2')
        return jsonify(get_what_sells(date1, date2))


@app.route('/xreport', methods=['GET'])
# @cross_origin(origins=ORIGIN, methods=["GET"])
def xreport():
    if request.method == 'GET':
        return jsonify(get_xreport())


@app.route('/zreport', methods=['GET', 'POST'])
# @cross_origin(origins=ORIGIN, methods=["GET", "POST"])
def zreport():
    if request.method == 'GET':
        return jsonify(get_zreport())
    elif request.method == 'POST':
        if (post_eodinv()):
            return jsonify({'success': True})
        else:
            return jsonify({'success': False})


@app.route('/salesreport', methods=['GET'])
# @cross_origin(origins=ORIGIN, methods=["GET"])
def salesreport():
    if request.method == 'GET':
        date1 = request.args.get('date1')
        date2 = request.args.get('date2')
        return jsonify(get_sales(date1, date2))


@app.route('/restockreport', methods=['GET'])
# @cross_origin(origins=ORIGIN, methods=["GET"])
def restockreport():
    if request.method == 'GET':
        return jsonify(get_low_inventory())


@app.route('/excessreport', methods=['GET'])
# @cross_origin(origins=ORIGIN, methods=["GET"])
def excessreport():
    if request.method == 'GET':
        date = request.args.get('date')
        return jsonify(get_excess(date))


@app.route('/prices', methods=['GET', 'POST'])
# @cross_origin(origins=ORIGIN, methods=["GET", "POST"])
def prices():
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
# @cross_origin(origins=ORIGIN, methods=["GET", "POST"])
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
