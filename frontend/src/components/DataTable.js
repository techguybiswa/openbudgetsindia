import React from "react";
import { Table, Tag, Button } from "antd";
import { Select, Typography, Divider, Row, Col } from "antd";
import DataTableVisualization from "./DataTableVisualization";
import { fetchAllDepartmentData } from "../utils/api";
const { Option } = Select;
const { Title } = Typography;

const { Column, ColumnGroup } = Table;
class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      departmentData: null,
      filterObject: null,
      filteredInfo: null,
      sortedInfo: null,
      filterValues: [],
      filterStatus: "Filter",
      rowRecord: null,
      chartData: null,
    };
  }

  handleChangeOfFilter = (value) => {
    this.setState({
      filterValues: value,
    });
  };

  getMapOfAllDepartments = (data) => {
    let mapOfDepartments = {};
    for (var i = 0; i < data.length; i++) {
      let tmp = data[i];
      let tmpHead = data[i];
      let nameOfDepartment = tmp["Ministries/Departments"];
      let nameOfHeadOfDepartment = tmp["Detailed Head of Expenditure"];
      mapOfDepartments[nameOfDepartment] = true;
      mapOfDepartments[nameOfHeadOfDepartment] = true;
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

  fetchAllDepartmentDetails = async () => {
    let departmentData = await fetchAllDepartmentData();
    // let listOfDepartments = []
    // Object.keys(departmentData).map(eachKey => {
    //   departmentData[eachKey].map(eachDepartment => {
    //     listOfDepartments.push(eachDepartment)
    //   })
    // })
    // departmentData = listOfDepartments
    return departmentData;
  };
  filterTable = async () => {
    if (this.state.filterValues.length == 0) {
      return;
    }
    this.setState({
      filterStatus: "Filtering...",
    });
    let departmentData = await this.fetchAllDepartmentDetails();
    this.setState({
      departmentData,
    });
    let sortedValue = this.state.departmentData.filter((eachRow) => {
      return (
        this.state.filterValues.indexOf(eachRow["Ministries/Departments"]) !=
          -1 ||
        this.state.filterValues.indexOf(
          eachRow["Detailed Head of Expenditure"]
        ) != -1
      );
    });
    this.setState({
      departmentData: sortedValue,
      filterStatus: "Filter",
    });
  };
  clearFilter = async () => {
    let departmentData = await this.fetchAllDepartmentDetails();
    this.setState({
      departmentData,
      filterValues: [],
      dataModalVisible: false,
    });
  };
  showDataModal = (record) => {
    console.log(record);

    const chartData = [
      {
        name: "Actual 2018-2019 Total",
        Amount: record["Actual 2018-2019 Total"],
      },
      {
        name: "Budget 2019-2020 Total",
        Amount: record["Budget 2019-2020 Total"],
        AmountRevised: record["Revised 2019-2020 Total"],
      },
      // {
      //   name: "Revised 2019-2020 Total",
      //   AmountRevised: record["Revised 2019-2020 Total"],
      // },
      {
        name: "Budget 2020-2021 Total",
        Amount: record["Budget 2020-2021 Total"],
      },
    ];

    this.setState({
      dataModalVisible: true,
      rowRecord: record,
      chartData,
    });
  };
  hideDataModal = () => {
    this.setState({
      dataModalVisible: false,
      rowRecord: null,
    });
  };
  componentDidMount = async () => {
    let departmentData = await this.fetchAllDepartmentDetails();
    console.log("departmentData", departmentData);

    let count = 0;
    let filterObject = this.getMapOfAllDepartments(departmentData);

    const columns = [
      {
        title: "Ministries / Departments",
        dataIndex: "Ministries/Departments",
        key: "Ministries/Departments",
        width: 250,
      },
      {
        title: "Detailed Head of Expenditure",
        dataIndex: "Detailed Head of Expenditure",
        key: "Detailed Head of Expenditure",
        width: 300,
      },
      {
        title: "Actual 2018-2019 Total",
        key: "Actual 2018-2019 Total",
        dataIndex: "Actual 2018-2019 Total",
        sorter: {
          compare: (a, b) =>
            a["Actual 2018-2019 Total"] - b["Actual 2018-2019 Total"],
          multiple: 3,
        },
      },
      {
        title: "Budget 2019-2020 Total",
        key: "Budget Estimates 2019-2020 Total",
        dataIndex: "Budget 2019-2020 Total",
        sorter: {
          compare: (a, b) =>
            a["Budget 2019-2020 Total"] - b["Budget 2019-2020 Total"],
          multiple: 2,
        },
      },
      {
        title: "Revised 2019-2020 Total",
        dataIndex: "Revised 2019-2020 Total",
        key: "Revised 2019-2020 Total",
        sorter: {
          compare: (a, b) =>
            a["Revised 2019-2020 Total"] - b["Revised 2019-2020 Total"],
          multiple: 1,
        },
      },
      {
        title: "Budget 2020-2021 Total",
        dataIndex: "Budget 2020-2021 Total",
        key: "Budget 2020-2021 Total",
        sorter: {
          compare: (a, b) =>
            a["Budget 2020-2021 Total"] - b["Budget 2020-2021 Total"],
          multiple: 0,
        },
      },
      {
        title: "Visualization",
        key: "Budget Estimates 2020-2021 Total",
        render: (record) => (
          <Button onClick={() => this.showDataModal(record)}>Show More</Button>
        ),
      },
    ];

    this.setState({
      columns,
      departmentData,
    });
  };

  render() {
    let { departmentData, columns, sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    return (
      <div>
        <div>
          <h1
            style={{
              fontFamily: "Open Sans",
              fontWeight: "font-weight",
              color: "#515B5E",
              marginTop: "30px",
            }}
          >
            Detailed department-wise division of budgets of
            Ministries/Departments (2018-2021)
          </h1>
          <Row style={{ marginBottom: "20px" }}>
            <Col  xs={24}
                  sm={24}
                  md={24}
                  lg={10}
                  xl={10}>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select Ministry/Department..."
                value={this.state.filterValues}
                onChange={this.handleChangeOfFilter}
                options={this.state.filterObject}
              />
            </Col>
            <Col  xs={0}
                  sm={0}
                  md={0}
                  lg={1}
                  xl={1}></Col>
            <Col 
             xs={6}
                  sm={6}
                  md={6}
                  lg={2}
                  xl={2}
                  >
              <Button onClick={this.filterTable} type="info">
                {this.state.filterStatus}
              </Button>
            </Col>
            <Col 
             xs={6}
                  sm={6}
                  md={6}
                  lg={2}
                  xl={2}
                  >
              <Button onClick={this.clearFilter} type="danger">
                Clear Filters
              </Button>
            </Col>
          </Row>

          <Row>
            <Col span={24} style={{overflow: "scroll"}}>
              <Table
                columns={columns}
                dataSource={departmentData}
                size="small"
              />
            </Col>
          </Row>
          <DataTableVisualization
            visible={this.state.dataModalVisible}
            hideDataModal={this.hideDataModal}
            record={this.state.rowRecord}
            chartData={this.state.chartData}
          />
        </div>
      </div>
    );
  }
}

export default DataTable;
