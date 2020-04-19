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
  AreaChart, Area,
} from "recharts";
import { PieChart, Pie, Sector } from "recharts";
import {
  LineChart, Line,
} from 'recharts';
const { Option } = Select;

const { Title } = Typography;

const { Column, ColumnGroup } = Table;

class AllDepartmentsVisual extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentSummaryData: null,
      sortedDepartmentSummaryData : null,
      pieChartData: null,
      totalBudget: null,
      lineChartData: null
    };
  }


  componentDidMount = () => {
    this.showSummaryOfDepartment();
    this.fetchTotalBudgetData()
  };
  getRemainingBudget = () => {
    let count = 0;
    for (var i = 1; i <= 12; i++) {
      let tmpValue = this.state.departmentSummaryData[i];
      count = count + tmpValue["Percentage of Budget"];
    }
    let result = 100 - count;

    return parseInt(result.toPrecision(3));
  };
  renderDataForPieChart = () => {
    const { departmentSummaryData } = this.state;
    const pieChartData = [
      {
        name: "Repayment of loans",
        value: departmentSummaryData[1]["Percentage of Budget"],
      },
      {
        name: "Defence services and military",
        value: departmentSummaryData[2]["Percentage of Budget"],
      },
      {
        name: "Transfered to the states",
        value: departmentSummaryData[3]["Percentage of Budget"],
      },
      {
        name: "Department of Revenue",
        value: departmentSummaryData[4]["Percentage of Budget"],
      },

      {
        name: "For agriculture and farmers",
        value: departmentSummaryData[5]["Percentage of Budget"],
      },
      {
        name: "Paying pensions for Defence people",
        value: departmentSummaryData[6]["Percentage of Budget"],
      },
      {
        name: "For public distribution of food",
        value: departmentSummaryData[7]["Percentage of Budget"],
      },

      {
        name: "Capital Outlay of devence",
        value: departmentSummaryData[9]["Percentage of Budget"],
      },
      {
        name: "For the Police department",
        value: departmentSummaryData[10]["Percentage of Budget"],
      },
      {
        name: "For Roads and transport",
        value: departmentSummaryData[11]["Percentage of Budget"],
      },
      {
        name: "For Railways",
        value: departmentSummaryData[12]["Percentage of Budget"],
      },

      {
        name: "Others departments and ministries",
        value: this.getRemainingBudget(),
      },
    ];
    this.setState({
      pieChartData,
    });
  };
  showSummaryOfDepartment = async () => {
    let departmentSummaryData = await fetch(
      `http://localhost:5000/departments-summary`
    ).then((response) => response.json());
    console.log("departmentSummaryData", departmentSummaryData);
    this.setState({
      departmentSummaryData,
    });
    this.renderDataForPieChart(departmentSummaryData);
  };
  renderDataForLineChart = () => {
    let { totalBudget } = this.state;
    console.log("totalBudget" , totalBudget);
    let lineChartData = [
      {year: "2016/2017", budget: totalBudget["Actuals 2016-2017 Total"]},
      {year: "2017/2018", budget: totalBudget["Budget Estimates 2017-2018 Total"]},
      {year: "2018/2019", budget: totalBudget["Budget Estimates 2018-2019 Total"]},
      {year: "2019/2020", budget: totalBudget["Budget Estimates 2019-2020 Total"]},
      {year: "2020/2021", budget: totalBudget["Budget Estimates 2020-2021 Total"]},

    ]

    this.setState({
      lineChartData
    })


  };
  fetchTotalBudgetData = async () => {
    let totalBudget = await fetch(
      `http://localhost:5000/total-budget`
    ).then((response) => response.json());
    console.log("totalBudget", totalBudget);
    this.setState({
      totalBudget,
    });
    this.renderDataForLineChart(totalBudget);
  };
  getCurrentYearSummary = () => {
    let curretYear = this.state.totalBudget["Budget Estimates 2020-2021 Total"];
    let previousYear = this.state.totalBudget["Budget Estimates 2019-2020 Total"];
    if(curretYear == "..." || previousYear == "..."){
        return `increades/decreased by [DATA ABSENT]`
    }
    let difference =   curretYear - previousYear
    let differencePercentage = (Math.abs(difference) / previousYear)*100;

    if(difference>0) {
        return `has increased by  ${differencePercentage.toFixed(3)}% which amounts to ${difference.toFixed(3)} crores`
    } else if (difference < 0) {
      return `has decreased by ${differencePercentage.toFixed(3)}% which amounts to ${Math.abs(difference.toFixed(3))} crores`
    } else {
        return `has remained the same`
    }
}
  render() {
    return (
      <div>
        <Row>
          <Col span={12}>
          <h1>Government budget over the past years</h1>
          <AreaChart
        width={500}
        height={200}
        isAnimationActive={true}

        data={this.state.lineChartData}
        margin={{
          top: 10, right: 30, left: 0, bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="budget" stroke="#8884d8" activeDot={{ r: 8 }} />
      </AreaChart>

      {
             this.state.totalBudget != null ? <div>
                  <h3><u>Brief Insights:</u></h3>
      <h4>> This year the budget is INR  {this.state.totalBudget["Budget Estimates 2020-2021 Total"].toFixed(3)} crores</h4>

            <h4>> The budget of 2020-21 {this.getCurrentYearSummary()} as compared to the past year</h4>
            {/* <h4>> The budget for {this.props.departmentSummaryData["Ministries/Departments"]} accounts for {((this.props.departmentSummaryData["Budget Estimates 2020-2021 Total"]/3042230)*100).toFixed(3)} % of the the toal budget </h4> */}

             </div> : ""
         }
          </Col>
          <Col span={12}>
            <h1>How government spends every 100 INR from the budget?</h1>

            <PieChart width={400} height={400}>
              <Pie
                dataKey="value"
                isAnimationActive={true}
                data={this.state.pieChartData}
                cx={200}
                cy={200}
                outerRadius={100}
                fill="#8884d8"
                label
              />
              <Tooltip />
            </PieChart>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AllDepartmentsVisual;
