import React, { Component } from 'react'
import './App.css'
import * as d3 from 'd3'

let w = 1050
let h = 640
let p = 100

class App extends Component {
  componentDidMount() {
    this.svg = d3.select(this.refs.chart)
                 .append('svg')
                 .attr('width', w)
                 .attr('height', h)

   fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
   .then(raw => raw.json())
   .then(data => {
     console.log(data.data)
     this.renderChart(data)
   })
  }

  renderChart(data) {
    let parseDate = d3.timeParse('%Y-%m-%d')
    let formateTime = d3.timeFormat("%Y %B %d")
    let dataParsed = data.data.map(d => {
      return [parseDate(d[0]), d[1]]
    })
    let xScale = d3.scaleTime()
                   .domain(d3.extent(dataParsed, (d, i) => d[0]))
                   .range([p, w - p])
    let yScale = d3.scaleLinear()
                   .domain([0, d3.max(dataParsed, (d, i) => d[1])])
                   .range([h - p, p])
    let valueline = d3.line()
                      .x((d, i) => xScale(d[0]))
                      .y((d, i) => yScale(d[1]))

    // append line
    this.svg.append('path')
            .attr('class', 'line')
            .datum(dataParsed)
            .attr('d', valueline)

    // append axis
    this.svg.append('g')
        .attr('transform', `translate(0, ${h - p})`)
        .call(d3.axisBottom(xScale))
    this.svg.append('g')
        .attr('transform', `translate(${p}, 0)`)
        .call(d3.axisLeft(yScale))

    // append tooltip
    let tooltip = d3.select(this.refs.chart).append('div')
                                            .attr('id', 'tooltip')

    // append dot
    this.svg.selectAll('dot')
            .data(dataParsed)
            .enter()
            .append('circle')
            .attr('r', 3)
            .attr('cx', (d, i) => xScale(d[0]))
            .attr('cy', (d, i) => yScale(d[1]))
            .style('fill', 'steelblue')
            .on('mouseover', function(d, i) {
               console.log(d3.select(this))
               d3.select(this).attr('r', 7)
                              .attr('stroke-width', 4)
                              .style('stroke', 'red')
                              .style('z-index', 11)
               let x = d3.event.pageX
               let y = d3.event.pageY
               tooltip.style('left', x - 190 + 'px')
                      .style('top', y - 75 + 'px')
                      .style('opacity', 1)
                      .html(`GDP: ${d[1]} Billion USD <br />Time: ${formateTime(d[0])}`)
               console.log(tooltip)
            })
            .on('mouseout', function(d, i) {
              d3.select(this).attr('r', 3)
                             .attr('stroke-width', 0)
                             .style('stroke', 'steelblue')
              tooltip.style('opacity', 0)
            })

    // append label
    this.svg.append('text')
            .attr('text-anchor', 'middle')
            .attr("transform", "translate("+ (w/2) +","+(p-30)+")")
            .text('Gross Domestic Product')
            .style('font-size', 32)
    this.svg.append('text')
            .attr('text-anchor', 'middle')
            .attr("transform", "translate("+ (p + 20) +","+(p + 130)+")rotate(-90)")
            .text('Gross Domestic Product, USA(Billion USD)')
  }

  render() {
    return (
      <div className="App">
        <div className="chart" ref="chart" />
      </div>
    )
  }
}

export default App;
