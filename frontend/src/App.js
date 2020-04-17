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
      <div>
        Hello indiex
        <AllDepartmentsVisual/>
        
        <DataTable/>
      </div>
    );
  }
}

export default App;
