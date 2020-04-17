import React from "react";
import { Table, Tag, Button } from "antd";
import { Select, Typography, Divider } from "antd";
import DataVisual from './DataVisual'
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

  fetchAllDepartmentDetails = async () => {
    const departmentData = await fetch(
      `http://localhost:5000/departments`
    ).then((response) => response.json());
    return departmentData;
  };
  filterTable = async () => {
    if(this.state.filterValues.length == 0){
      return 
    }
    this.setState({
      filterStatus:  "Filtering..."
    })
    let departmentData = await this.fetchAllDepartmentDetails();
    this.setState({
      departmentData,
    });
    let sortedValue = this.state.departmentData.filter((eachRow) => {
      return (
        this.state.filterValues.indexOf(eachRow["Ministries/Departments"]) != -1
      );
    });
    this.setState({
      departmentData: sortedValue,
      filterStatus:  "Filter"

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
    console.log(record)

    const chartData =  [
      {
        name: "Actual 2018-2019 Total",
        Amount: record["Actual 2018-2019 Total"],
      },
      {
        name: "Budget 2019-2020 Total",
       Amount: record["Budget 2019-2020 Total"]
      },
      {
        name: "Revised 2019-2020 Total",
        Amount: record["Revised 2019-2020 Total"],
    
      },
      {
        name: "Budget 2020-2021 Total",
       Amount: record["Budget 2020-2021 Total"]
      },
      
     
    ] ;

    this.setState({
      dataModalVisible: true,
      rowRecord: record,
      chartData
    })
  }
  hideDataModal = () => {
    this.setState({
      dataModalVisible: false,
      rowRecord: null,
    })
  }
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
      },
      {
        title: "Detailed Head of Expenditure",
        dataIndex: "Detailed Head of Expenditure",
        key: "Detailed Head of Expenditure",
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
        )
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
          <Select
            mode="multiple"
            style={{ width: "500px" }}
            placeholder="Select Ministry/Department..."
            value={this.state.filterValues}
            onChange={this.handleChangeOfFilter}
            options={this.state.filterObject}
           
          />
          <Button onClick={this.filterTable}>{this.state.filterStatus}</Button>
          <Button onClick={this.clearFilter}>Clear Filter</Button>

          <Table columns={columns} dataSource={departmentData} />
          <DataVisual visible={this.state.dataModalVisible} hideDataModal={this.hideDataModal} record={this.state.rowRecord} chartData={this.state.chartData}/>
        </div>
      </div>
    );
  }
}

export default DataTable;
