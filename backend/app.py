from flask import Flask, request, jsonify
import uuid
import duckdb

from flask_cors import CORS

from create_subset import create_subset

app = Flask(__name__)
CORS(app)

@app.route('/generate_subset', methods=['POST'])
def generate_subset():
    data = request.json
    name = data.get('name')
    starting_node = data.get('starting_node')
    property_id = data.get('property_id')
    depth = data.get('depth', 5)

    subset_id = str(uuid.uuid4())

    create_subset(subset_id, name, starting_node, property_id, depth)

    result = {
        "subset_id": subset_id,
        "name": name,
        "language": "en",
        "message": "Subset created successfully."
    }

    return jsonify(result), 201


@app.route('/list_subsets', methods=['GET'])
def list_subsets():
    with duckdb.connect('wikidata.db') as conn:
        result = conn.execute("SELECT * FROM user_subsets.metadata").df().to_dict(orient='records')
    return result


@app.route('/get_subset/<subset_id>', methods=['GET'])
def get_subset(subset_id):
    with duckdb.connect('wikidata.db') as conn:
        node_df = conn.execute(f"SELECT * FROM user_subsets.items where subset_id = '{subset_id}'").df()
        edge_df = conn.execute(f"SELECT * FROM user_subsets.claims where subset_id = '{subset_id}'").df()
        colormap = conn.execute(f"SELECT * FROM user_subsets.property where subset_id = '{subset_id}'").df()

    subset_data = {
        "nodes": node_df.to_dict(orient="records"),
        "edges": edge_df.to_dict(orient="records"),
        "colormap": colormap.to_dict(orient="records")
    }

    return jsonify(subset_data)


if __name__ == "__main__":
    app.run(debug=True)
