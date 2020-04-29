import React from "react";
import { Table, Tag, Button, Row, Col, Divider, Switch, Card } from "antd";
import { Select, Typography, Modal, Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import DepartmentSummaryVisual from "./DepartmentSummaryVisual";
import DepartmentVisual from "./DepartmentVisual";
import {
  fetchDepartmentSummaryData,
  fetchBudgetGrandTotal,
} from "../utils/api";
import ScatterAllDepartment from "./ScatterAllDepartment";
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
  Treemap,
} from "recharts";
import "./style.css";
import { PieChart, Pie, Sector } from "recharts";
import { LineChart, Line } from "recharts";
const { Option } = Select;

const { Title } = Typography;

const { Column, ColumnGroup } = Table;

const CustomTooltipTreeMap = ({ active, payload, label }) => {
  if (active) {
    console.log(payload);
    return (
      <div
        className="custom-tooltip"
        style={{ padding: "10px", border: "apx solid black" }}
      >
        {/* <p>  </p> */}
        <Tag color="geekblue">
          INR {payload[0].payload.size.toFixed(2)} for{" "}
          {payload[0].payload.fullName}
        </Tag>
      </div>
    );
  }

  return null;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div
        className="custom-tooltip"
        style={{ padding: "10px", border: "1px solid black" }}
      >
        <p className="label">{`${label} : ${payload[0].value}`}</p>

        <p className="label">
          Percentage Change: {`${payload[0].payload["Increase/Decrease by "]}`}
        </p>
        <p className="label">
          Percentage Allocated:{" "}
          {`${payload[0].payload["Percentage Allocated"]}`}
        </p>
      </div>
    );
  }

  return null;
};
const CustomTooltipSorted = ({ active, payload, label }) => {
  if (active) {
    console.log(payload);
    return (
      <div
        className="custom-tooltip"
        style={{ padding: "10px", border: "1px solid black" }}
      >
        <p className="label">{`${label} : ${payload[0].payload["Budget 2020"]}`}</p>

        <p className="label">
          Percentage Change: {`${payload[0].payload["Increase/Decrease by "]}`}
        </p>
        <p className="label">
          Percentage Allocated:{" "}
          {`${payload[0].payload["Percentage Allocated"]}`}
        </p>
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
      departmentSummaryDataCopy: null,
      sortedDepartmentSummaryData: null,
      pieChartData: null,
      totalBudget: null,
      lineChartData: null,
      barChartData: null,
      start: 1,
      end: 20,
      sortOrder: null,
      filterObject: null,
      filterValues: [],
      filterStatus: "Filter",
      switch: 0,
      switchText: "Scatter Chart",
      areaChartWidth: window.innerWidth - 0.2 * window.innerWidth,
      barChartWidth: window.innerWidth - 0.2 * window.innerWidth,
    };
  }

  componentDidMount = () => {
    this.showSummaryOfDepartment();
    this.fetchTotalBudgetData();
    window.addEventListener("resize", this.handleResize);

    if (window.innerWidth > 1000) {
      this.setState({
        areaChartWidth: 550,
        barChartWidth: 1150,
      });
    }
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
        name: `Repaying loans`,
        fullName: "Repaying loans",
        size: departmentSummaryData[1]["Percentage of Budget"],
      },
      {
        name: "Defence",
        fullName: "Defence services (Revenue)",
        size: departmentSummaryData[2]["Percentage of Budget"],
      },
      {
        name: "State Transfer",
        fullName: "Transfer to states",
        size: departmentSummaryData[3]["Percentage of Budget"],
      },
      {
        name: "Revenue",
        fullName: "Department of Revenue",
        size: departmentSummaryData[4]["Percentage of Budget"],
      },

      {
        name: "Agriculture",
        fullName: "Department of Agriculture, Cooperation and Farmers' Welfare",
        size: departmentSummaryData[5]["Percentage of Budget"],
      },
      {
        name: "Pension",
        fullName: "Defence Pension",
        size: departmentSummaryData[6]["Percentage of Budget"],
      },
      {
        name: "Foods",
        fullName: " Public distribution of food",
        size: departmentSummaryData[7]["Percentage of Budget"],
      },
      {
        name: "Rural",
        fullName: "Department of Rural Development",
        size: departmentSummaryData[8]["Percentage of Budget"],
      },

      {
        name: "Defence",
        fullName: "Capital Outlay on Defence Services",
        size: departmentSummaryData[9]["Percentage of Budget"],
      },
      {
        name: "Police",
        fullName: " The Police department",
        size: departmentSummaryData[10]["Percentage of Budget"],
      },
      {
        name: "Transport",
        fullName: " Roads and transport",
        size: departmentSummaryData[11]["Percentage of Budget"],
      },
      {
        name: "Rail",
        fullName: "Railways",
        size: departmentSummaryData[12]["Percentage of Budget"],
      },

      {
        name: "Others",
        fullName: "Other departments and ministries",

        size: this.getRemainingBudget(),
      },
    ];
    this.setState({
      pieChartData,
    });
  };
  showSummaryOfDepartment = async () => {
    let departmentSummaryData = await fetchDepartmentSummaryData();
    console.log("departmentSummaryData", departmentSummaryData);
    this.setState({
      departmentSummaryData,
      departmentSummaryDataCopy: departmentSummaryData,
    });
    this.renderDataForPieChart(departmentSummaryData);
    this.renderDataForBarChart();
    this.generateFilterObject(departmentSummaryData);
  };
  generateFilterObject = (data) => {
    let mapOfDepartments = {};
    for (var i = 0; i < data.length; i++) {
      let tmp = data[i];
      let nameOfDepartment = tmp["Ministries/Departments"];
      mapOfDepartments[nameOfDepartment] = true;
    }
    console.log("mapOfDepartments", mapOfDepartments);
    let filterObject = [];
    Object.keys(mapOfDepartments).map((eachObject) => {
      let obj = {
        text: eachObject,
        value: eachObject,
      };
      filterObject.push(obj);
    });
    this.setState({
      filterObject,
    });
    return filterObject;
  };
  renderDataForBarChart = () => {
    let { start, end } = this.state;
    let { departmentSummaryData } = this.state;
    let barChartData = [];
    for (var i = start; i <= end; i++) {
      console.log(departmentSummaryData[i]["Ministries/Departments"]);
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
    let totalBudget = await fetchBudgetGrandTotal();
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
      return differencePercentage;
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
    let data = this.state.departmentSummaryDataCopy;
    data = data.sort((a, b) => {
      return b["Percentage Change"] - a["Percentage Change"];
    });
    this.setState(
      {
        filterValues: [],

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
    let data = this.state.departmentSummaryDataCopy;
    data = data.sort((a, b) => {
      return b["Percentage of Budget"] - a["Percentage of Budget"];
    });

    this.setState(
      {
        filterValues: [],

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
  handleChangeOfFilter = (value) => {
    this.setState({
      filterValues: value,
    });
  };
  clearFilter = () => {
    this.setState(
      {
        filterValues: [],
        departmentSummaryData: this.state.departmentSummaryDataCopy,
      },
      () => {
        this.sortByPercentageAllocated();
      }
    );
  };
  filterChart = () => {
    if (this.state.filterValues.length == 0) {
      return;
    }
    this.setState({
      filterStatus: "Filtering...",
    });
    let data = this.state.departmentSummaryDataCopy;
    data = data.filter((eachData) => {
      return (
        this.state.filterValues.indexOf(eachData["Ministries/Departments"]) !=
        -1
      );
    });
    this.setState(
      {
        departmentSummaryData: data,
        start: 0,
        end: this.state.filterValues.length - 1,
        filterStatus: "Filter",
      },
      () => {
        this.renderDataForBarChart();
      }
    );
  };
  switch = () => {
    this.setState({
      switch: !this.state.switch,
    });
  };
  handleResize = () => {
    if (window.innerWidth < 1000) {
      this.setState({
        barChartWidth: window.innerWidth - 0.2 * window.innerWidth,
        areaChartWidth: window.innerWidth - 0.2 * window.innerWidth,
      });
    } else {
      this.setState({
        areaChartWidth: 550,
        barChartWidth: 1150,
      });
    }

    console.log("resizing " + window.innerWidth);
  };
  render() {
    return (
      <div>
        <Row>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
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
            <div style={{ overflow: "hidden" }}>
              <AreaChart
                width={this.state.areaChartWidth}
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
            </div>
            {this.state.totalBudget != null ? (
              <div>
                <div
                  style={{
                    backgroundColor: "#ececec",
                    padding: "10px",
                    marginLeft: "30px",
                    marginRight: "40px",
                    marginTop: "10px",
                  }}
                >
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={14} xl={14}>
                      <Card>
                        <Statistic
                          title="Budget 2020-21"
                          value={
                            this.state.totalBudget[
                              "Budget Estimates 2020-2021 Total"
                            ]
                          }
                          precision={0}
                          valueStyle={{ color: "#3f8600" }}
                          suffix="CRORE"
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                      <Card>
                        <Statistic
                          title="Percentage"
                          value={this.getCurrentYearSummary()}
                          precision={2}
                          valueStyle={{ color: "#3f8600" }}
                          prefix={<ArrowUpOutlined />}
                          suffix="%"
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>

                {/* <h4>> The budget for {this.props.departmentSummaryData["Ministries/Departments"]} accounts for {((this.props.departmentSummaryData["Budget Estimates 2020-2021 Total"]/3042230)*100).toFixed(3)} % of the the toal budget </h4> */}
              </div>
            ) : (
              ""
            )}
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <h1
              style={{
                fontFamily: "Open Sans",
                fontWeight: "font-weight",
                color: "#515B5E",
              }}
            >
              How government spends every 100 INR from the budget?
            </h1>
            <br />
            <br />

            <div style={{ overflow: "scroll" }}>
              <Treemap
                width={this.state.areaChartWidth}
                height={250}
                data={this.state.pieChartData}
                dataKey="size"
                ratio={4 / 3}
                stroke="#fff"
                fill="#8884d8"
              >
                <Tooltip content={<CustomTooltipTreeMap />} />
              </Treemap>
            </div>
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
              Expenditure Budget of Ministries/Departments &nbsp;&nbsp;
              {this.state.sortOrder == null ? (
                <Tag color="success">Sorted by Percentage Allocated</Tag>
              ) : (
                <Tag color="processing">
                  Sorted by Percentage Increase/Decrease
                </Tag>
              )}
            </h1>

            <Row style={{ marginBottom: "20px" }}>
              <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Select Ministry/Department..."
                  value={this.state.filterValues}
                  onChange={this.handleChangeOfFilter}
                  options={this.state.filterObject}
                />
              </Col>
              <Col xs={0} sm={0} md={0} lg={1} xl={1}></Col>
              <Col
                xs={8}
                sm={8}
                md={8}
                lg={2}
                xl={2}
                className="filter-btn-grp"
              >
                <Button onClick={this.filterChart} type="info">
                  {this.state.filterStatus}
                </Button>
              </Col>
              <Col
                xs={8}
                sm={8}
                md={8}
                lg={2}
                xl={2}
                className="filter-btn-grp"
              >
                <Button onClick={this.clearFilter} type="danger">
                  Clear
                </Button>
              </Col>
              <Col
                xs={8}
                sm={8}
                md={8}
                lg={2}
                xl={2}
                className="filter-btn-grp"
              >
                <Button onClick={this.switch} type="info">
                  {this.state.switch == 0 ? "Scatter Chart" : "Bar Chart"}
                </Button>
              </Col>
            </Row>
            {this.state.switch == 1 ? (
              <Row>
                <ScatterAllDepartment data={this.state.departmentSummaryData} />
              </Row>
            ) : (
              <div>
                <div className="btn-sort">
                  <Button
                    onClick={this.sortByPercentageIncrease}
                    style={{ display: "inline" }}
                    type={this.state.sortOrder != null ? "primary" : ""}
                  >
                    Sort by percentage increase
                  </Button>
                  &nbsp;
                  <Button
                    onClick={this.sortByPercentageAllocated}
                    style={{ display: "inline" }}
                    type={this.state.sortOrder == null ? "primary" : ""}
                  >
                    Sort by percentage allocated
                  </Button>
                </div>
                <Row style={{ marginTop: "40px" }}>
                  <Col span={24}>
                    <br />
                    <br />

                    <div className="barchart" style={{marginTop: "30px"}}>


                      <BarChart
                        width={this.state.barChartWidth}
                        height={300}
                        data={this.state.barChartData}
                        margin={{}}
                      >
                        <CartesianGrid strokeDasharray="9 9" />
                        <XAxis dataKey="name" />
                        <YAxis />

                        <Legend />
                        <ReferenceLine y={0} stroke="#000" />

                        {this.state.sortOrder == null ? (
                          <Tooltip content={<CustomTooltip />} />
                        ) : (
                          <Tooltip content={<CustomTooltipSorted />} />
                        )}
                        {this.state.sortOrder == null ? (
                          <Bar dataKey="Budget 2020" fill="#03ab97" />
                        ) : (
                          <Bar dataKey="Increase/Decrease by " fill="#8884d8" />
                        )}
                      </BarChart>
                    </div>
                  </Col>
                </Row>
                <Row style={{ marginTop: "20px", marginBottom: "20px" }}>
                  <Col xs={0}
                sm={0}
                md={0}
                lg={8}
                xl={8}></Col>
                  <Col 
                  xs={7}
                  sm={7}
                  md={7}
                  lg={2}
                  xl={2}>
                    <Button onClick={this.showPrev}>Previous</Button>
                  </Col>
                  <Col 
                   xs={10}
                   sm={10}
                   md={10}
                   lg={4}
                   xl={4}>
                    <p>
                      Displaying {this.state.start} to {this.state.end} of{" "}
                      {this.state.departmentSummaryData.length - 1}
                    </p>
                  </Col>
                  <Col 
                   xs={7}
                   sm={7}
                   md={7}
                   lg={2}
                   xl={2}>
                    <Button onClick={this.showNext}>Next</Button>
                  </Col>
                  <Col xs={0}
                sm={0}
                md={0}
                lg={8}
                xl={8}></Col>                </Row>
              </div>
            )}
          </div>
        ) : (
          "Loading...."
        )}
      </div>
    );
  }
}

export default AllDepartmentsVisual;
