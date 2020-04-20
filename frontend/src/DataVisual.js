import React from "react";
import { Table, Tag, Button, Row, Col } from "antd";
import { Select, Typography, Divider, Modal, Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import DepartmentSummaryVisual from "./DepartmentSummaryVisual";
import DepartmentVisual from "./DepartmentVisual";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
const { Option } = Select;

const { Title } = Typography;

const { Column, ColumnGroup } = Table;

class DataVisual extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: null,
      departmentSummaryData: null,
      chartDataForSummary: null
    };
  }

  handleOk = (e) => {
    this.props.hideDataModal();
  };

  handleCancel = (e) => {
    this.props.hideDataModal();
    this.setState({
        departmentSummaryData: null
    })
  };

  componentDidMount = async () => {
    console.log("MOUNTING...");
  };

  showSummaryOfDepartment = async () => {
    let departmentSummaryData = await fetch(
      `http://bisso1998.pythonanywhere.com//department/` +
        this.props.record["Ministries/Departments"]
    ).then((response) => response.json());
    console.log("departmentSummaryData", departmentSummaryData);
    let chartDataForSummary = [
        {
            name: "2016-2017", 
            "Capital": departmentSummaryData["Actuals 2016-2017 Capital"], 
            "Revenue": departmentSummaryData["Actuals 2016-2017 Revenue"], 
            "Total": departmentSummaryData["Actuals 2016-2017 Total"],
        },
        {
        name: "2017-2018", 
        "Capital": departmentSummaryData["Budget Estimates 2017-2018 Capital"], 
        "Revenue": departmentSummaryData["Budget Estimates 2017-2018 Revenue"], 
        "Total": departmentSummaryData["Budget Estimates 2017-2018 Total"],
    },
    {
        name: "2018-2019", 
        "Capital": departmentSummaryData["Budget Estimates 2018-2019 Capital"], 
        "Revenue": departmentSummaryData["Budget Estimates 2018-2019 Revenue"], 
        "Total": departmentSummaryData["Budget Estimates 2018-2019 Total"],
    },
    {
        name: "2019-2020", 
        "Total": departmentSummaryData["Budget Estimates 2019-2020 Total"],
    },
    {
        name: "2020-2021", 
        "Total": departmentSummaryData["Budget Estimates 2020-2021 Total"],
    }]

    this.setState({
      departmentSummaryData,
      chartDataForSummary
    });
  };
  render() {
    return (
      <div>
        <Modal
          title={
            this.props.record ? this.props.record["Ministries/Departments"] : ""
          }
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1000}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Return
            </Button>,
            <Button
              key="submit"
              style={{ backgroundColor: "green", color: "white" }}
              onClick={this.showSummaryOfDepartment}
            >
              Show summary of department
            </Button>,
          ]}
        >
          {this.state.departmentSummaryData == null ? (
            <DepartmentVisual
              record={this.props.record}
              chartData={this.props.chartData}
            />
          ) : (
            <DepartmentSummaryVisual
              departmentSummaryData={this.state.departmentSummaryData}
              chartDataForSummary={this.state.chartDataForSummary}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default DataVisual;
