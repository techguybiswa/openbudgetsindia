import React from "react";
import DataTable from './DataTable'
import AllDepartmentsVisual from  './AllDepartmentsVisual'
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div style={{paddingLeft: "20px", paddingRight: "20px"}}>
        <AllDepartmentsVisual/>
        <DataTable/>
      </div>
    );
  }
}

export default App;
