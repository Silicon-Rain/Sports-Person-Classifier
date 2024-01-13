from flask import Flask,request,jsonify,json
from flask_cors import CORS, cross_origin

import util

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/classify_image',methods=['POST','GET'])
@cross_origin()
def classify_image():
    # print(request.get_json()['image_data'])
    image_data = request.get_json()['image_data']

    response = jsonify(util.classify_image(image_data))

    # response.headers.add('Access-Control-Allow-Origin', '*')
    print(response.data)

    return response


if __name__ == "__main__":
    print("Starting Python Flask Server for Sports Celebrity Image Classification")
    util.load_saved_artifacts()
    app.run(port=5000)