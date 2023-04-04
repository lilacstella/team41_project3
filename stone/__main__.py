from flask import Flask, request, jsonify

from menusql import get_menus, process_order

app = Flask(__name__)

@app.route('/menu', methods=['GET', 'POST'])
def example():
    if request.method == 'GET':
        return jsonify(get_menus())
    elif request.method == 'POST':
        json_data = request.get_json()
        if(json_data is None):
            return jsonify({"error": "Invalid JSON"})
        process_order(json_data)
        return jsonify({'success': True})


if __name__ == '__main__':
    app.run(debug=True)
