from flask import Flask, request, jsonify
from stone.inventorysql import get_current_inventory, restock_all, restock_items
from stone.weather_api_requests import get_weather
from stone.menusql import get_menus, process_order

app = Flask(__name__)


@app.route('/menu', methods=['GET', 'POST'])
def menu():
    print('hi')
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
    if request.method == 'GET':
        return jsonify(get_current_inventory())
    elif request.method == 'POST':
        json_data = request.get_json()
        if (not json_data or json_data is None):
            restock_all()
            return jsonify({'success restockall': True})
        else:
            restock_items(request.get_json())
            return jsonify({'success restock': True})


@app.route('/weather', methods=['GET'])
def weather():
    if request.method == 'GET':
        return jsonify(get_weather())


if __name__ == '__main__':
    app.run(debug=True)
