import React from "react";
import { Table, Tag, Button, Row, Col } from "antd";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ScatterChart,
} from "recharts";

const { Column, ColumnGroup } = Table;

class ScatterAllDepartment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: null,
      zoomValue: 50,
    };
  }

  componentDidUpdate(prevProps) {
    console.log("1998");
    // Typical usage (don't forget to compare props):
    if (this.props.data !== prevProps.data) {
      this.renderScatterChart();
    }
  }

  renderScatterChart = () => {
    let data = this.props.data;
    data = data.filter((eachData) => {
      return eachData["Ministries/Departments"] !== "Grand Total";
    });
    this.setState({
      chartData: data,
      chartDataCopy: data,
    });
    console.log("MY PROPS ", this.props.data);
  };

  componentDidMount = () => {
    this.renderScatterChart();
  };
  zoomIn = () => {
    let data = this.state.chartData;
    if (this.state.zoomValue - 10 == 0) {
      alert("Max zoom reached");
      return;
    }
    data = data.filter((eachData) => {
      if (
        eachData["Percentage Change"] >= -this.state.zoomValue &&
        eachData["Percentage Change"] <= this.state.zoomValue
      ) {
        return true;
      }
    });
    this.setState({
      chartData: data,
      zoomValue: this.state.zoomValue - 10,
    });
  };
  reset = () => {
    this.setState({
      chartData: this.state.chartDataCopy,
      zoomValue: 50,
    });
  };
  render() {
    return (
      <div>
        <ScatterChart
          width={1100}
          height={400}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="Percentage Change"
            name="Percentage Change"
          />
          <YAxis
            type="number"
            dataKey="Percentage of Budget"
            name="Percentage of budget"
          />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter name="A school" data={this.state.chartData} fill="#8884d8" />
        </ScatterChart>
        <Row>
          <Col span={10}></Col>
          <Col span={2}>
            <Button onClick={this.zoomIn}>Zoom In</Button>
          </Col>

          <Col span={2}>
            <Button onClick={this.reset} type="danger">
              Zoom Reset
            </Button>
          </Col>
          <Col span={10}></Col>
        </Row>
      </div>
    );
  }
}

export default ScatterAllDepartment;
