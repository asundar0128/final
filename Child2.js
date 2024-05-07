import React, { Component } from "react";
import * as d3 from "d3";

class Child2 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate() {
    console.log(this.props.data2);
    var data = this.props.data2;
    var marginValue = { top: 10, right: 10, bottom: 30, left: 20 },
      w = 500 - marginValue.left - marginValue.right,
      h = 300 - marginValue.top - marginValue.bottom;

    var container = d3
      .select(".child2_svg")
      .attr("width", w + marginValue.left + marginValue.right)
      .attr("height", h + marginValue.top + marginValue.bottom)
      .select(".g_2")
      .attr("transform", `translate(${marginValue.left}, ${marginValue.top})`);

    var xAxisDataValue = data.map((item) => item.total_bill);
    const x_scale = d3.scaleLinear().domain([0, d3.max(xAxisDataValue)]).range([0, w]);

    container
      .selectAll(".x_axis_g")
      .data([0])
      .join("g")
      .attr("class", "x_axis_g")
      .attr("transform", `translate(0, ${h})`)
      .call(d3.axisBottom(x_scale));

    var y_data = data.map((item) => item.tip);
    const y_scale = d3.scaleLinear().domain([0, d3.max(y_data)]).range([h, 0]);
    container
      .selectAll(".y_axis_g")
      .data([0])
      .join("g")
      .attr("class", "y_axis_g")
      .attr("transform", `translate(${marginValue.left},0)`)
      .call(d3.axisLeft(y_scale));

    container
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", function (d) {
        return x_scale(d.total_bill);
      })
      .attr("cy", function (d) {
        return y_scale(d.tip);
      })
      .attr("r", 3)
      .style("fill", "#69b3a2");

    var scatterplotRoot = d3.hierarchy({ children: data });
    var scatterplotLayout = d3.tree().size([h, w]);
    scatterplotLayout(scatterplotRoot);

    var scatterplotTooltip = d3.select("body").selectAll(".tooltip_div").data([0]).join("div").attr("class", "tooltip_div").style("position", "absolute").style("visibility", "hidden");

    d3.select(".child2_svg")
      .append("g")
      .attr("class", "parent")
      .selectAll(".link")
      .data(scatterplotRoot.links())
      .join("line")
      .attr("class", "link")
      .attr("x1", (d) => d.source.y)
      .attr("y1", (d) => d.source.x)
      .attr("x2", (d) => d.target.y)
      .attr("y2", (d) => d.target.x);

    d3.select(".child2_svg")
      .select(".parent")
      .selectAll(".label")
      .data(scatterplotRoot.descendants())
      .join("text")
      .attr("class", "label")
      .attr("x", (d) => d.y - 15)
      .attr("y", (d) => d.x - 15)
      .text((d) => {
        return d.data.name;
      });

    d3.select(".child2_svg")
      .select(".parent")
      .selectAll(".node")
      .data(scatterplotRoot.descendants())
      .join("circle")
      .attr("class", "node")
      .attr("cx", (d) => d.y)
      .attr("cy", (d) => d.x)
      .attr("r", 4)
      .on("mouseover", (event, d) => {
        scatterplotTooltip.html(d.data.name).style("visibility", "visible");
      })
      .on("mousemove", (event) => {
        scatterplotTooltip.style("top", event.pageY - 10 + "px").style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", (event) => {
        scatterplotTooltip.style("visibility", "hidden");
      });
  }

  render() {
    return (
      <svg className="child2_svg">
        <g className="g_2"></g>
      </svg>
    );
  }
}

export default Child2;
