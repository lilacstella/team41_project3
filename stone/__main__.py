from flask import Flask, request, jsonify

from stone.example_feature import example_get, example_post

app = Flask(__name__)


@app.route('/example', methods=['GET', 'POST'])
def example():
    if request.method == 'GET':
        return jsonify(example_get(request.args))
    elif request.method == 'POST':
        return jsonify(example_post(request.get_json()))


if __name__ == '__main__':
    app.run(debug=True)
