from flask import Flask, request, jsonify, send_file
import os
import json
import uuid

from flask_cors import CORS

from create_subset import create_subset

app = Flask(__name__)
CORS(app)

SUBSET_DIR = 'subsets'

@app.route('/generate_subset', methods=['POST'])
def generate_subset():
    data = request.json
    starting_node = data.get('starting_node')
    property_id = data.get('property_id')
    depth = data.get('depth', 5)

    subset_id = str(uuid.uuid4())

    data = create_subset(starting_node, property_id, depth)

    with open(f'{SUBSET_DIR}/{subset_id}.json', 'w') as f:
        json.dump(data, f, indent=4)


@app.route('/list_subsets', methods=['GET'])
def list_subsets():
    subset_files = [f for f in os.listdir(SUBSET_DIR) if f.endswith('.json')]
    subsets = [file.removesuffix(".json") for file in subset_files]
    return jsonify(subsets)


@app.route('/get_subset/<subset_id>', methods=['GET'])
def get_subset(subset_id):
    subset_file = os.path.join(SUBSET_DIR, f'{subset_id}.json')

    if os.path.exists(subset_file):
        with open(subset_file, 'r') as file:
            data = json.load(file)  # Load JSON data from file
        return jsonify(data)  # Return JSON content of the file
    else:
        return jsonify({"error": "Subset not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)
