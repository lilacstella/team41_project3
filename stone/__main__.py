from flask import Flask, request, jsonify

from stone.example_feature import example_get, example_post
from stone.inventorysql import get_current_inventory, restock_all, restock_items
from stone.weather_api_requests import get_weather

app = Flask(__name__)


@app.route('/example', methods=['GET', 'POST'])
def example():
    if request.method == 'GET':
        return jsonify(example_get(request.args))
    elif request.method == 'POST':
        return jsonify(example_post(request.get_json()))


#inventory
app = Flask(__name__)

@app.route('/inventory', methods=['GET', 'POST_ALL', 'POST'])

def inventory():
    if request.method == 'GET':
        return jsonify(get_current_inventory())
    elif request.method == 'POST':
        json_data = request.get_json()
        if(not json_data):
            restock_all()
            return jsonify({'success restockall': True})
        else:
            restock_items(request.get_json())
            return jsonify({'success restock': True})

#weather
@app.route('/weather', methods=['GET'])
def weather():
    if request.method == 'GET':
        return jsonify(get_weather())


if __name__ == '__main__':
    app.run(debug=True)
    

