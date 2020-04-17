from flask import Flask, render_template, json, current_app as app

import os


api = Flask(__name__)
@api.route('/departments', methods=['GET'])
def get_detartments():
  filename = os.path.join(app.static_folder, 'data', 'data.json')
  with open(filename) as data_json:
    data = json.load(data_json)
  # return json.dumps(companies)
  return json.dumps(data)

@api.route('/departments-summary', methods=['GET'])
def get_detartments_summary():
  filename = os.path.join(app.static_folder, 'data', 'dataSummary.json')
  with open(filename) as data_json:
    data = json.load(data_json)
  # return json.dumps(companies)
  return json.dumps(data)
if __name__ == '__main__':
  api.run()
