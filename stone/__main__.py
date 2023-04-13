from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from stone.inventorysql import get_current_inventory, restock_all, restock_items
from stone.weather import get_weather
from stone.menusql import get_menus, process_order
from stone.whatsellssql import get_what_sells
from stone.xreportsql import get_xreport
from stone.zreportsql import get_zreport, post_eodinv
from stone.salesreportsql import get_sales

app = Flask(__name__)
cors = CORS(app)


@app.route('/menu', methods=['GET', 'POST'])
@cross_origin(origins="http://localhost:3000", methods=["GET", "POST"])
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
@cross_origin(origins="http://localhost:3000", methods=["GET", "POST"])
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
@cross_origin(origins="http://localhost:3000", methods=["GET"])
def weather():
    if request.method == 'GET':
        return jsonify(get_weather())

@app.route('/whatsells', methods=['GET'])
@cross_origin(origins="http://localhost:3000", methods=["GET"])
def whatsells():
    if request.method == 'GET':
        json_data = request.get_json()
        if json_data is None:
            return jsonify({"error": "Invalid JSON"})
        return jsonify(get_what_sells(request.get_json()))

@app.route('/xreport', methods=['GET'])
@cross_origin(origins="http://localhost:3000", methods=["GET"])
def xreport():
    if request.method == 'GET':
        return jsonify(get_xreport())
        
@app.route('/zreport', methods=['GET', 'POST'])
@cross_origin(origins="http://localhost:3000", methods=["GET", "POST"])
def zreport():
    if request.method == 'GET':
        return jsonify(get_zreport())
    elif request.method == 'POST':
        if(post_eodinv()):
            return jsonify({'success': True})
        else:
            return jsonify({'success': False})
        
@app.route('/salesreport', methods=['GET'])
@cross_origin(origins="http://localhost:3000", methods=["GET"])
def salesreport():
    if request.method == 'GET':
        date1 = request.args.get('date1')
        date2 = request.args.get('date2')
        return jsonify(get_sales(date1, date2))


if __name__ == '__main__':
    app.run(debug=True)
