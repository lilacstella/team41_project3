from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from stone.inventorysql import get_current_inventory, restock_all, restock_items
from stone.weather import get_weather
from stone.menusql import get_menus, process_order
from stone.whatsellssql import what_sells

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
        return jsonify(what_sells(request.get_json()))

if __name__ == '__main__':
    app.run(debug=True)
