from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from stone.inventorysql import get_current_inventory, restock_all, restock_items
from stone.weather import get_weather
from stone.translate import do_translate
from stone.menu import get_menus, process_order
from stone.whatsellssql import get_what_sells
from stone.xreportsql import get_xreport
from stone.zreportsql import get_zreport, post_eodinv
from stone.salesreportsql import get_sales
from stone.restockreportsql import get_low_inventory
from stone.excessreportsql import get_excess
from stone.prices import get_prices, change_price, add_inv_item, add_menu_item

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
        date1 = request.args.get('date1')
        date2 = request.args.get('date2')
        return jsonify(get_what_sells(date1, date2))

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
    
@app.route('/restockreport', methods=['GET'])
@cross_origin(origins="http://localhost:3000", methods=["GET"])
def restockreport():
    if request.method == 'GET':
        return jsonify(get_low_inventory())
    
@app.route('/excessreport', methods=['GET'])
@cross_origin(origins="http://localhost:3000", methods=["GET"])
def excessreport():
    if request.method == 'GET':
        date = request.args.get('date')
        return jsonify(get_excess(date))
    
@app.route('/prices', methods=['GET', 'POST'])
@cross_origin(origins="http://localhost:3000", methods=["GET", "POST"])
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
        else:
            result = False
        return jsonify({"sucess": result})        

@app.route('/translate', methods=['GET'])
@cross_origin(origins="http://localhost:3000", methods=["GET"])
def translate():
    if request.method == 'GET':
        text = request.args.get('text')
        target_lang = request.args.get('target_lang')
        return jsonify(do_translate(text, target_lang))

if __name__ == '__main__':
    app.run(debug=True)
