import json
import requests
import datetime
import time
from flask import Flask, render_template, make_response


app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('index.html', data='test')

@app.route('/live-data')
def live_data():
    # Create a PHP array and echo it as JSON

    url = "http://twin.iab.berlin:8086/query?pretty=true&db=twin"
    params = {"q":"select pressure from V2 where hash='virtual/SingleStage' order by time desc limit 1"}
    r = requests.get(url, params=params).json()
    t = r['results'][0]['series'][0]['values'][0][0]

    data_timestamp = datetime.datetime.strptime(t, '%Y-%m-%dT%H:%M:%S.%fZ').timestamp()
    data_value = r['results'][0]['series'][0]['values'][0][1]

    data_point = [data_timestamp, data_value]


    response = make_response(json.dumps(data_point))
    response.content_type = 'application/json'
    return response

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
