import React from "react";
import { Table, Tag, Button, Row, Col, Divider } from "antd";
import { Select, Typography, Modal, Statistic } from "antd";
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
  AreaChart,
  Area,
  ReferenceLine,
} from "recharts";
import { PieChart, Pie, Sector } from "recharts";
import { LineChart, Line } from "recharts";
const { Option } = Select;

const { Title } = Typography;

const { Column, ColumnGroup } = Table;

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    console.log(payload);
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
        <p className="label">
          Percentage Change: {`${payload[0].payload["Increase/Decrease by "]}`}
        </p>
        <p className="label">
          Percentage Allocated:{" "}
          {`${payload[0].payload["Percentage Allocated"]}`}
        </p>
        {/* <p className="desc">Anything you want can be displayed here.</p> */}
      </div>
    );
  }

  return null;
};
class AllDepartmentsVisual extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentSummaryData: null,
      sortedDepartmentSummaryData: null,
      pieChartData: null,
      totalBudget: null,
      lineChartData: null,
      barChartData: null,
      start: 1,
      end: 20,
      sortOrder: null,
    };
  }

  componentDidMount = () => {
    this.showSummaryOfDepartment();
    this.fetchTotalBudgetData();
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
    this.renderDataForBarChart();
  };
  renderDataForBarChart = () => {
    let { start, end } = this.state;
    let { departmentSummaryData } = this.state;
    let barChartData = [];
    for (var i = start; i <= end; i++) {
      let data = {
        name: departmentSummaryData[i]["Ministries/Departments"],
        "Budget 2020":
          departmentSummaryData[i]["Budget Estimates 2020-2021 Total"],
        "Increase/Decrease by ": departmentSummaryData[i]["Percentage Change"],
        "Percentage Allocated":
          departmentSummaryData[i]["Percentage of Budget"],
      };
      barChartData.push(data);
    }
    this.setState({
      barChartData,
    });
    console.log("barChartData", this.state.barChartData);
  };

  renderDataForLineChart = (totalBudget) => {
    // let { totalBudget } = this.state;
    console.log("totalBudget", totalBudget);
    let lineChartData = [
      {
        year: "2016/2017",
        budget: totalBudget["Actuals 2016-2017 Total"],
      },
      {
        year: "2017/2018",
        budget: totalBudget["Budget Estimates 2017-2018 Total"],
      },
      {
        year: "2018/2019",
        budget: totalBudget["Budget Estimates 2018-2019 Total"],
      },
      {
        year: "2019/2020",
        budget: totalBudget["Budget Estimates 2019-2020 Total"],
      },
      {
        year: "2020/2021",
        budget: totalBudget["Budget Estimates 2020-2021 Total"],
      },
    ];

    this.setState({
      lineChartData,
    });
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
    let previousYear = this.state.totalBudget[
      "Budget Estimates 2019-2020 Total"
    ];
    if (curretYear == "..." || previousYear == "...") {
      return `increades/decreased by [DATA ABSENT]`;
    }
    let difference = curretYear - previousYear;
    let differencePercentage = (Math.abs(difference) / previousYear) * 100;

    if (difference > 0) {
      return `has increased by  ${differencePercentage.toFixed(
        3
      )}% which amounts to ${difference.toFixed(3)} crores`;
    } else if (difference < 0) {
      return `has decreased by ${differencePercentage.toFixed(
        3
      )}% which amounts to ${Math.abs(difference.toFixed(3))} crores`;
    } else {
      return `has remained the same`;
    }
  };
  showNext = () => {
    let { start, end, departmentSummaryData } = this.state;

    let maxLength = departmentSummaryData.length - 1;
    let minLength = 1;
    if (end == maxLength) {
      alert("End of graph reached");
      return 0;
    }
    if (end + 20 > maxLength) {
      this.setState(
        {
          start: start + (maxLength - end),
          end: end + (maxLength - end),
        },
        () => {
          this.renderDataForBarChart();
        }
      );
    } else {
      this.setState(
        {
          start: start + 20,
          end: end + 20,
        },
        () => {
          this.renderDataForBarChart();
        }
      );
    }
  };
  showPrev = () => {
    let { start, end, departmentSummaryData } = this.state;

    let maxLength = departmentSummaryData.length - 1;
    let minLength = 1;
    if (start <= minLength) {
      alert("End of graph reached");
      return 0;
    }
    if (start - 10 < minLength) {
      this.setState(
        {
          start: start - (start - minLength),
          end: end - (end - minLength),
        },
        () => {
          this.renderDataForBarChart();
        }
      );
    } else {
      this.setState(
        {
          start: start - 20,
          end: end - 20,
        },
        () => {
          this.renderDataForBarChart();
        }
      );
    }
  };
  sortByPercentageIncrease = () => {
    let data = this.state.departmentSummaryData;
    data = data.sort((a, b) => {
      return b["Percentage Change"] - a["Percentage Change"];
    });
    this.setState(
      {
        departmentSummaryData: data,
        start: 0,
        end: 20,
        sortOrder: "percentageInc",
      },
      () => {
        this.renderDataForBarChart();
      }
    );
  };

  sortByPercentageAllocated = () => {
    let data = this.state.departmentSummaryData;
    data = data.sort((a, b) => {
      return b["Percentage of Budget"] - a["Percentage of Budget"];
    });

    this.setState(
      {
        departmentSummaryData: data,
        start: 1,
        end: 20,
        sortOrder: null,
      },
      () => {
        this.renderDataForBarChart();
      }
    );
  };

  render() {
    return (
      <div>
        <Row>
          <Col span={12}>
            <h1
              style={{
                fontFamily: "Open Sans",
                fontWeight: "font-weight",
                color: "#515B5E",
              }}
            >
              Expenditure Budget over the past years (2016-2021)
            </h1>
            <br />
            <AreaChart
              width={500}
              height={200}
              isAnimationActive={true}
              data={this.state.lineChartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="budget"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </AreaChart>

            {this.state.totalBudget != null ? (
              <div>
                <h3
                  style={{
                    fontFamily: "Open Sans",
                    fontWeight: "font-weight",
                    color: "#515B5E",
                    marginTop: "10px"
                  }}
                >
                  <u>Brief Insights:</u>
                </h3>
                <h4
                  style={{
                    fontFamily: "Open Sans",
                    fontWeight: "font-weight",
                    color: "#515B5E",
                  }}
                >
                  > This year the budget is INR{" "}
                  {this.state.totalBudget[
                    "Budget Estimates 2020-2021 Total"
                  ].toFixed(3)}{" "}
                  crores
                </h4>

                <h4
                  style={{
                    fontFamily: "Open Sans",
                    fontWeight: "font-weight",
                    color: "#515B5E",
                  }}
                >
                  > The budget of 2020-21 {this.getCurrentYearSummary()} as
                  compared to the past year
                </h4>
                {/* <h4>> The budget for {this.props.departmentSummaryData["Ministries/Departments"]} accounts for {((this.props.departmentSummaryData["Budget Estimates 2020-2021 Total"]/3042230)*100).toFixed(3)} % of the the toal budget </h4> */}
              </div>
            ) : (
              ""
            )}
          </Col>
          <Col span={12}>
            <h1
              style={{
                fontFamily: "Open Sans",
                fontWeight: "font-weight",
                color: "#515B5E",
              }}
            >
              How government spends every 100 INR from the budget?
            </h1>
            <PieChart width={400} height={400} style={{ marginTop: "-70px" }}>
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
        <Divider />

        {this.state.barChartData != null ? (
          <div>
            <h1
              style={{
                fontFamily: "Open Sans",
                fontWeight: "font-weight",
                color: "#515B5E",
              }}
            >
              Expenditure Budget of Ministries and Departments
              &nbsp;&nbsp; {
                this.state.sortOrder == null ? <Tag color="success">Sorted by Percentage Allocated</Tag> : <Tag color="processing">Sorted by Percentage Increase/Decrease</Tag>
              }
            </h1>
          <div style={{float: "right" , display: "block" , paddingBottom: "20px"}}>
          <Button onClick={this.sortByPercentageIncrease} style={{display: "inline"}}  type={this.state.sortOrder != null ? "primary" : ""} >
                Sort by percentage increase
              </Button>
              &nbsp;
              <Button onClick={this.sortByPercentageAllocated} style={{display: "inline"}} type={this.state.sortOrder == null ? "primary" : ""}>
                Sort by percentage allocated
              </Button>
            </div>
            <Row style={{ marginTop: "30px" }}>
              <Col span={12}>
              <br/>

                <BarChart
                  width={1150}
                  height={300}
                  data={this.state.barChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="9 9" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <ReferenceLine y={0} stroke="#000" />
                  {/* <Bar dataKey="percentageChange" fill="#82ca9d" /> */}
                  {this.state.sortOrder == null ? (
                    <Bar dataKey="Budget 2020" fill="#03ab97" />
                  ) : (
                    <Bar dataKey="Increase/Decrease by " fill="#8884d8" />
                  )}
                </BarChart>
              </Col>
         
             
            </Row>
            <Row style={{marginTop: "20px" , marginBottom: "20px"}}>
              <Col span={8}>

              </Col>
              <Col span={2}>
              <Button onClick={this.showPrev} >Previous</Button>

              </Col>
              <Col span={4}>
                  <p>Displaying {this.state.start} to {this.state.end} of {this.state.departmentSummaryData.length -1}</p>
              </Col>
              <Col span={2}>
              <Button onClick={this.showNext} >Next</Button>

              </Col>
              <Col span={8}>

              </Col>
            </Row>
          </div>
        ) : (
          "Loading...."
        )}
      </div>
    );
  }
}

export default AllDepartmentsVisual;
