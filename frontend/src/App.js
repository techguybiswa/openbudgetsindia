import React from "react";
import DataTable from "./components/DataTable";
import { Layout, Menu, Divider } from "antd";

import AllDepartmentsVisual from "./components/AllDepartmentsVisual";
const { Header, Content, Footer } = Layout;
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Layout className="layout">
          <Header>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
              <Menu.Item key="1">Budget Explorer 2020</Menu.Item>
              {/* <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item> */}
            </Menu>
          </Header>
          <Content style={{ padding: "50px" }}>
            <div style={{ backgroundColor: "white", padding: "20px" }}>
              <AllDepartmentsVisual />
              <Divider />

              <DataTable />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Created by @techguybiswa
          </Footer>
        </Layout>
      </div>
    );
  }
}

export default App;
