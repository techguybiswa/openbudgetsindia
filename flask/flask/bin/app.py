from flask import Flask, render_template, json, current_app as app
from flask_cors import CORS

import os


api = Flask(__name__)
CORS(api)
@api.route('/', methods=['GET'])
def get_welcome_page():
  return "Welcome Success"
@api.route('/departments', methods=['GET'])
def get_detartments():
  filename = os.path.join(app.static_folder, 'data', 'data.json')
  with open(filename) as data_json:
    data = json.load(data_json)
  # return json.dumps(companies)
  return json.dumps(data)

@api.route('/department/<string:department_name>', methods = ['GET'])
def get_department_details(department_name):
    filename = os.path.join(app.static_folder, 'data', 'dataSummary.json')
    with open(filename) as data_json:
        data = json.load(data_json)
    for i in data:
        if i["Ministries/Departments"] == department_name:
            return i
        
    return json.dumps(data)


@api.route('/departments-summary', methods=['GET'])
def get_detartments_summary():
  filename = os.path.join(app.static_folder, 'data', 'dataSummary.json')
  with open(filename) as data_json:
    data = json.load(data_json)
  for i in data:
    i["Percentage of Budget"] = round((i["Budget Estimates 2020-2021 Total"]/3042230)*100,2)
  data = sorted(data, key=lambda data:data["Percentage of Budget"], reverse=True) 

  # return json.dumps(companies)
  return json.dumps(data)

@api.route('/total-budget', methods=['GET'])
def get_total_budget():
    filename = os.path.join(app.static_folder, 'data', 'dataSummary.json')
    with open(filename) as data_json:
        data = json.load(data_json)
    for i in data:
      if i["Ministries/Departments"] == "Grand Total":
        return i
if __name__ == '__main__':
  api.run()
