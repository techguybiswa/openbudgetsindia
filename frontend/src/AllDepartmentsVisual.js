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
import {
    PieChart, Pie, Sector
  } from "recharts";
const { Option } = Select;

const { Title } = Typography;

const { Column, ColumnGroup } = Table;

class AllDepartmentsVisual extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        departmentSummaryData: null,
        pieChartData :null,
    };
  }


componentDidMount = ()=> {
    this.showSummaryOfDepartment()
    
}
getRemainingBudget = () => {
    let count = 0
    for (var i =1; i<=12;i++){
        let tmpValue = this.state.departmentSummaryData[i]
        count = count + tmpValue["Percentage of Budget"]
    }
    let result = 100 - count
    return result
}
renderDataForPieChart = (renderDataForPieChart) => {
    console.log(renderDataForPieChart)
    const {
        departmentSummaryData
    } = this.state;
    const pieChartData = [

        { name: 'Repayment of loans', value: departmentSummaryData[1]["Percentage of Budget"]}, 
        { name: 'Defence services and military', value: departmentSummaryData[2]["Percentage of Budget"] }, 
        { name: 'Transfered to the states', value: departmentSummaryData[3]["Percentage of Budget"] }, 
        { name: 'Department of Revenue', value: departmentSummaryData[4]["Percentage of Budget"] }, 

        { name: 'For agriculture and farmers', value: departmentSummaryData[5]["Percentage of Budget"] }, 
        { name: 'Paying pensions for Defence people',value :  departmentSummaryData[6]["Percentage of Budget"] }, 
        { name: 'For public distribution of food', value : departmentSummaryData[7]["Percentage of Budget"] }, 

        { name: 'Capital Outlay of devence', value: departmentSummaryData[9]["Percentage of Budget"] }, 
        { name: 'For the Police department', value: departmentSummaryData[10]["Percentage of Budget"] }, 
        { name: 'For Roads and transport', value: departmentSummaryData[11]["Percentage of Budget"] }, 
        { name: 'For Railways', value: departmentSummaryData[12]["Percentage of Budget"] }, 

        { name: 'Others departments and ministries', value: this.getRemainingBudget()}, 




      ];
      this.setState({
        pieChartData
      })
}
  showSummaryOfDepartment = async () => {
    let departmentSummaryData = await fetch(
      `http://localhost:5000/departments-summary`
    ).then((response) => response.json());
    console.log("departmentSummaryData", departmentSummaryData);
    this.setState({
        departmentSummaryData,
      });
    this.renderDataForPieChart(departmentSummaryData)
   
  };
  render() {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
      <div>
        <h1>How government spends every 100 INR from the budget?</h1>
 
        <PieChart width={400} height={400}>
        <Pie dataKey="value" isAnimationActive={true} data={this.state.pieChartData} cx={200} cy={200} outerRadius={100} fill="#8884d8" label />
        <Tooltip />
      </PieChart>
      </div>
    );
  }
}

export default AllDepartmentsVisual;
