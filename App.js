import React, { Component } from "react";
import * as d3 from "d3";
import sample from './SampleDataset.csv'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCell: null,
      target:"total_bill",
      radio: "sex",
      data:[]
    };
  }
  componentDidMount() {
    var self=this
    d3.csv(sample, function(d){
      return {
        x:parseFloat(d.x),
        y:parseFloat(d.y),
        category: parseInt(d.category),
      }
    }).then(function(csv_data){
      self.setState({data:csv_data})
      //console.log(csv_data)
    })
    .catch(function(err){
      console.log(err)
    })

  }
  
  componentDidUpdate() {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 30, left: 20 },
        w = 500 - margin.left - margin.right,
        h = 300 - margin.top - margin.bottom;
    // set the dimensions and margins of the graph
    var data=this.state.data;

    var temp_data = d3.flatRollup(
      data,     
      (d) => d3.mean(d, (da) => da[this.state.target]),
      (d) => d[this.state.radio],
    );

    
    var containerb = d3
      .select(".child1_svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .select(".g_1")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // X axis
    var xb_data = temp_data.map((item) => item[0]);
    var xb_scale = d3
      .scaleBand()
      .domain(xb_data)
      .range([margin.left, w])
      .padding(0.2);

    containerb
      .selectAll(".x_axis_g")
      .data([0])
      .join("g")
      .attr("class", "x_axis_g")
      .attr("transform", `translate(0, ${h})`)
      .call(d3.axisBottom(xb_scale));
    // Add Y axis
    var yb_data = temp_data.map((item) => item[1]);
    var yb_scale = d3
      .scaleLinear()
      .domain([0, d3.max(yb_data)])
      .range([h, 0]);

    containerb
      .selectAll(".y_axis_g")
      .data([0])
      .join("g")
      .attr("class", "y_axis_g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yb_scale));
    containerb.selectAll("rect").remove()
    containerb
      .selectAll("rect")
      .data(temp_data)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return xb_scale(d[0]);
      })
      .attr("y", function (d) {
        return yb_scale(d[1]);
      })
      .attr("width", xb_scale.bandwidth())
      .attr("height", function (d) {
        return h - yb_scale(d[1]);
      })
      .attr("fill", "#69b3a2");
      
    // Scatterplot
    let scatterx="";
    let scattery="";
    if(this.state.selectedCell && this.state.selectedCell[0]<50){ 
      scatterx="x";
    }
    else if(this.state.selectedCell && this.state.selectedCell[0]>50){ 
      scatterx="y"
    }
    else{ 
      scatterx="category"
    }

    if(this.state.selectedCell && this.state.selectedCell[1]<50){ 
      scattery="y";
    }
    else if(this.state.selectedCell && this.state.selectedCell[1]>50){ 
      scattery="x"
    }
    else{ 
      scattery="category"
    }
    console.log(scatterx,scattery)
    var container = d3.select(".child1_svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .select(".g_1")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var x_data = data.map(item=>item[scatterx])
    const x_scale = d3.scaleLinear().domain([0, d3.max(x_data)]).range([margin.left, w]);
    
    container.selectAll(".x_axis_g").data([0]).join('g').attr("class", 'x_axis_g')
    .attr("transform", `translate(0, ${h})`).call(d3.axisBottom(x_scale));

    var y_data = data.map(item=>item[scattery])
    const y_scale = d3.scaleLinear().domain([0, d3.max(y_data)]).range([h, 0]);
    container.selectAll(".y_axis_g").data([0]).join('g').attr("class", 'x_axis_g')
    .attr("transform", `translate(${margin.left}, 0)`).call(d3.axisLeft(y_scale));

    container.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", function(d){
            return x_scale(d.total_bill);
        })
        .attr("cy", function(d){
            return y_scale(d.tip);
        })
        .attr("r", 3)
        .style("fill", "#69b3a2");
  }

  render() {
    return (
      <div className="parent">
        <div className="child1">
        <select onChange={(event)=>this.setState({target:event.target.value})}>
          <option>x</option>
          <option>y</option>
          <option>category</option>
        </select>
        <svg id="demo2" width="500" height="300"></svg>
      </div>
        <div className="child2">
          <form>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  value="x"
                  checked={this.state.radio === "x"}
                  onChange={(event)=>this.setState({radio:event.target.value})}
                />
                x
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  value="y"
                  checked={this.state.radio === "smoker"}
                  onChange={(event)=>this.setState({radio:event.target.value})}
                />
                y
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  value="category"
                  checked={this.state.radio === "day"}
                  onChange={(event)=>this.setState({radio:event.target.value})}
                />
                category
              </label>
            </div>
          </form>
          <svg className="child2_svg">
            <g className="g_2"></g>
          </svg>
          <svg id="correlation-matrix"></svg>
          
        </div>
        <div className="child3">
          <svg className="child1_svg"> 
              <g className="g_1"></g>
          </svg>
        </div>
      </div>
    );
  }
}

export default App;
