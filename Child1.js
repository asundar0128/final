import React, { Component } from "react";
import * as d3 from "d3";
class Child1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate() {
    console.log(this.props.data1);
    var data = this.props.data1;
    var marginValue = { top: 10, right: 10, bottom: 30, left: 20 },
        w = 500 - marginValue.left - marginValue.right,
        h = 300 - marginValue.top - marginValue.bottom;
    var data=this.state.data1;

    var temporaryData = d3.flatRollup(
      data,     
      (d) => d3.mean(d, (da) => da[this.state.target]),
      (d) => d[this.state.radio],
    );

    
    var firstContainedValue = d3
      .select(".child1_svg")
      .attr("width", w + marginValue.left + marginValue.right)
      .attr("height", h + marginValue.top + marginValue.bottom)
      .select(".g_1")
      .attr("transform", `translate(${marginValue.left}, ${marginValue.top})`);

    // X axis
    var xAxisDataValue = temporaryData.map((item) => item[0]);
    var xAxisScaleValue = d3
      .scaleBand()
      .domain(xAxisDataValue)
      .range([marginValue.left, w])
      .padding(0.2);

      firstContainedValue
      .selectAll(".x_axis_g")
      .data([0])
      .join("g")
      .attr("class", "x_axis_g")
      .attr("transform", `translate(0, ${h})`)
      .call(d3.axisBottom(xAxisScaleValue));
    // Add Y axis
    var yAxisDataValue = temporaryData.map((item) => item[1]);
    var yAxisScaleValue = d3
      .scaleLinear()
      .domain([0, d3.max(yAxisDataValue)])
      .range([h, 0]);

      firstContainedValue
      .selectAll(".y_axis_g")
      .data([0])
      .join("g")
      .attr("class", "y_axis_g")
      .attr("transform", `translate(${marginValue.left},0)`)
      .call(d3.axisLeft(yAxisScaleValue));
      firstContainedValue.selectAll("rect").remove()
      firstContainedValue
      .selectAll("rect")
      .data(temporaryData)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return xAxisScaleValue(d[0]);
      })
      .attr("y", function (d) {
        return yAxisScaleValue(d[1]);
      })
      .attr("width", xAxisScaleValue.bandwidth())
      .attr("height", function (d) {
        return h - yAxisScaleValue(d[1]);
      })
      .attr("fill", "#69b3a2");
    }
  render() {
    return (
      <svg className="child1_svg">
        <g className="g_1"></g>
      </svg>
    );
  }
}
export default Child1;
