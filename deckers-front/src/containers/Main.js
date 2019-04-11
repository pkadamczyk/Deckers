import React, { Component } from "react";
import Navbar from "./Navbar";
import Content from "./Content";

class Main extends Component {
    render() {
      return (
        <div className="row">
        <div className="col-3">
          <Navbar />
        </div>
        <div className="col-9">
          <Content />
        </div> 
      </div>
      )
    }
}
export default Main;