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
 Brush
  
} from "recharts";
let zoomValues = [1.5,2.0,2.5,3,4,10]

const { Column, ColumnGroup } = Table;
const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
  console.log(payload)

    return (
      <div className="custom-tooltip" style={{backgroundColor: "rgba(255,255,255,0.5)" , border: "2px solid black" , padding: "5px"}}>
        <p><b>Department/Ministries</b> {payload[0].payload["Ministries/Departments"]}</p>
        <p><b>Percentage of Budget</b> {payload[0].payload["Percentage of Budget"]}</p>
        <p><b>Percentage Change</b> {payload[0].payload["Percentage Change"]}</p>
        <p><b> Budget Estimates 2020-2021 Total:</b> {payload[0].payload["Budget Estimates 2020-2021 Total"]}</p>
      </div>
    );
  }

  return null;
};
class ScatterAllDepartment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: null,
      zoomValueX: 50,
      zoomValueY: 20,
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


  zoomInY = () => {
    let data = this.state.chartData;
    let zoomFactor = zoomValues.pop()
    if (this.state.zoomValueY - zoomFactor < 0) {
      alert("Max zoom reached");
      return;
    }
    data = data.filter((eachData) => {
      if (
        eachData["Percentage of Budget"] >= -this.state.zoomValueY &&
        eachData["Percentage of Budget"] <= this.state.zoomValueY
      ) {
        return true;
      }
    });
    this.setState({
      chartData: data,
      zoomValueY: this.state.zoomValueY - zoomFactor,
    });
  };

  zoomInX = () => {
    let data = this.state.chartData;
    if (this.state.zoomValueX - 10 == 0) {
      alert("Max zoom reached");
      return;
    }
    data = data.filter((eachData) => {
      if (
        eachData["Percentage Change"] >= -this.state.zoomValueX &&
        eachData["Percentage Change"] <= this.state.zoomValueX
      ) {
        return true;
      }
    });
    this.setState({
      chartData: data,
      zoomValueX: this.state.zoomValueX - 10,
    });
  };
  reset = () => {
    zoomValues = [1.5,2.0,2.5,3,4,10]
        this.setState({
      chartData: this.state.chartDataCopy,
      zoomValueX: 50,
      zoomValueY: 20
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
          <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip />} />
          <Scatter name="A school" data={this.state.chartData} fill="#8884d8" />
          <Brush dataKey="Percentage of budget" height={30} stroke="#8884d8" />


        </ScatterChart>
        <Row>
          <Col span={8}></Col>
          <Col span={3}>
            <Button onClick={this.zoomInX}>Zoom In X</Button>
          </Col>
          <Col span={3}>
            <Button onClick={this.zoomInY}>Zoom In Y</Button>
          </Col>

          <Col span={2}>
            <Button onClick={this.reset} type="danger">
              Reset
            </Button>
          </Col>
          <Col span={8}></Col>
        </Row>
      </div>
    );
  }
}

export default ScatterAllDepartment;
