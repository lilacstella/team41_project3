from flask import Flask, request, jsonify

from stone.inventorysql import get_current_inventory, restock_all, restock_items

app = Flask(__name__)

@app.route('/inventory', methods=['GET', 'POST_ALL', 'POST'])

def inventory();
    if request.method == 'GET':
        return jsonify(get_current_inventory(request.args))
    elif request.method == 'POST_ALL':
        return jsonify(restock_all(request.get_json()))
    elif request.method == 'POST':
        return jsonify(restock_items(request.get_json()))