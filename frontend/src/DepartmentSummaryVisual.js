import React from "react";
import { Table, Tag, Button , Row,Col} from "antd";
import { Select, Typography, Divider, Modal , Statistic} from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart, Line, 
} from "recharts";
const { Option } = Select;

const { Title } = Typography;

const { Column, ColumnGroup } = Table;

class DepartmentSummaryData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        chartData: null,
    };
  }

  handleOk = (e) => {
    this.props.hideDataModal();
  };

  handleCancel = (e) => {
    this.props.hideDataModal();
  };

  componentDidMount = async () => {
    console.log("MOUNTING...");
  };
  getCurrentYearSummary = () => {
      if(this.props.departmentSummaryData["Budget Estimates 2020-2021 Total"] == "..." || this.props.departmentSummaryData["Budget Estimates 2019-2020 Total"] == "..."){
          return `increades/decreased by [DATA ABSENT]`
      }
      let difference =  this.props.departmentSummaryData["Budget Estimates 2020-2021 Total"] - this.props.departmentSummaryData["Budget Estimates 2019-2020 Total"]
      let differencePercentage = (Math.abs(difference) / this.props.departmentSummaryData["Budget Estimates 2019-2020 Total"])*100;
      if(difference>0) {
          return `has increased by  ${differencePercentage.toFixed(3)}% which amounts to ${difference.toFixed(3)} crores`
      } else if (difference < 0) {
        return `has decreased by ${differencePercentage.toFixed(3)}% which amounts to ${Math.abs(difference.toFixed(3))} crores`
      } else {
          return `has remained the same`
      }
  }
  getDiscrepencySummary = () => {
    if(this.props.record["Budget 2019-2020 Total"] == "..." || this.props.record["Revised 2019-2020 Total"] == "..."){
        return `[DATA ABSENT]`
    }
    let difference =   this.props.record["Revised 2019-2020 Total"] - this.props.record["Budget 2019-2020 Total"]
    let differencePercentage = (Math.abs(difference) / this.props.record["Budget 2019-2020 Total"])*100;
    if(difference>0) {
        return `was increased by ${differencePercentage.toFixed(3)}% which amounts to ${difference.toFixed(3)} crores`
    } else if (difference < 0) {
      return `was decreased by ${differencePercentage.toFixed(3)}% which amounts to ${Math.abs(difference.toFixed(3))} crores`
    } else {
        return ` same as the actual budget`
    }
}
showSummaryOfDepartment =async  () => {
    const departmentSummaryData = await fetch(
        `https://bisso1998.pythonanywhere.com///department/`+this.props.record["Ministries/Departments"]
      ).then((response) => response.json());
    console.log("departmentSummaryData" , departmentSummaryData)
}
  render() {
    return (
      <div>
    <h3>Summary of Budget of {this.props.departmentSummaryData["Ministries/Departments"]}</h3> 
                <br/>

      
              <BarChart
                width={900}
                height={300}
                data={this.props.chartDataForSummary}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis/>
                <Tooltip />
                <Legend />
                <Bar dataKey="Capital" fill="#8884d8" />
                <Bar dataKey="Revenue" fill="#82ca9d" />
                <Bar dataKey="Total" fill="#d18347" />

              </BarChart> 
          {
             this.props.departmentSummaryData != null ? <div>
                  <h3><u>Brief Insights:</u></h3>
            <h4>> The budget of 2020-21 {this.getCurrentYearSummary()} as compared to the past year</h4>
            <h4>> The budget for {this.props.departmentSummaryData["Ministries/Departments"]} accounts for {((this.props.departmentSummaryData["Budget Estimates 2020-2021 Total"]/3042230)*100).toFixed(3)} % of the the toal budget </h4>

             </div> : ""
         }
      </div>
    );
  }
}

export default DepartmentSummaryData;
