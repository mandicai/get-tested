let numberWeeks = 24

let timeStart = moment().toDate(),
  timeEnd = moment().add(numberWeeks, 'weeks').toDate()

let margin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 40
  },
  width = 550,
  height = 350,
  lanes = ['Chlamydia', 'Gonorrhea', 'Syphilis', 'HIV', 'Hepatitis A', 'Hepatitis B', 'Hepatitis C', 'Oral Herpes', ' Genital Herpes', 'Trichomoniasis', 'HPV'], // names of stds,
  miniHeight = 75, // height of mini brushable timeline
  mainHeight = height - miniHeight - 50, // height of bigger timeline,
  mainRectHeight = 12, // height of each window in the main timeline
  mainRectPadding = 1, // padding for main rectangles
  miniRectHeight = 5, // height of each window in the mini timeline
  miniRectPadding = 1, // padding for mini rectangles
  betweenCharts = 15, // space between charts
  labelSpace = 5, // space between STD labels and charts
  dottedLineX = 30, // x position of dotted line
  dottedLineLength = 15 // extra length of dotted line

// scales
let x = d3.scaleTime()
  .domain([timeStart, timeEnd])
  .range([margin.left, width - margin.right])

let x1 = d3.scaleLinear()
  .range([margin.left, width - margin.right])

let y1 = d3.scaleLinear()
  .domain([0, lanes.length])
  .range([0, mainHeight])

let y2 = d3.scaleLinear()
  .domain([0, lanes.length])
  .range([0, miniHeight])

// color scale
let sourceColors = d3.scaleOrdinal()
  .domain(lanes)
  .range(['rgb(91,88,143)', 'rgb(152,154,202)', 'rgb(35,34,66)', 'rgb(198,103,243)', 'rgb(46,13,147)', 'rgb(251,9,152)', 'rgb(121,35,103)', 'rgb(241,115,177)', 'rgb(45,109,249)', 'rgb(236,130,46)', 'rgb(93,24,0)'])

function setupCharts(stdWindows) {
  let svg = d3.select('#testing-timeline').append('svg')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('class', 'testing-timeline')

  svg.append('defs').append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', width)
    .attr('height', mainHeight)

  let timelineLabel = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + 5 + ')')

  timelineLabel.append('text')
    .text('Time of possible contraction')
    .attr('font-size', '7px')

  timelineLabel.append('text')
    .attr('dx', width - 67)
    .text(numberWeeks + ' weeks')
    .attr('font-size', '7px')

  let main = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width)
    .attr('height', mainHeight)
    .attr('class', 'main')

  let mini = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + (mainHeight + margin.top + betweenCharts) + ')')
    .attr('width', width)
    .attr('height', miniHeight)
    .attr('class', 'mini')

  main.append('g').selectAll('.lane-lines')
    .data(lanes)
    .enter().append('line')
    .attr('x1', margin.right)
    .attr('y1', function (d, i) {
      return y1(i)
    })
    .attr('x2', width - margin.left)
    .attr('y2', function (d, i) {
      return y1(i)
    })
    .attr('stroke', 'lightgray')

  main.append('g').selectAll('.lane-text')
    .data(lanes)
    .enter().append('text')
    .text(function (d) {
      return d
    })
    .attr('x', margin.right - labelSpace)
    .attr('y', function (d, i) {
      return y1(i)
    })
    .attr('text-anchor', 'end')
    .attr('class', 'lane-text main')

  mini.append('g').selectAll('.lane-lines')
    .data(lanes)
    .enter().append('line')
    .attr('x1', margin.right)
    .attr('y1', function (d, i) {
      return y2(i)
    })
    .attr('x2', width - margin.left)
    .attr('y2', function (d, i) {
      return y2(i)
    })
    .attr('stroke', 'lightgray')

  mini.append('g').selectAll('.lane-text')
    .data(lanes)
    .enter().append('text')
    .text(function (d) {
      return d
    })
    .attr('x', margin.right - labelSpace)
    .attr('y', function (d, i) {
      return y2(i)
    })
    .attr('dy', '.1ex')
    .attr('text-anchor', 'end')
    .attr('class', 'lane-text mini')

  let mainRects = main.append('g')
    .attr('clip-path', 'url(#clip)')

  //main item rects
  mainRects.selectAll('.main-items')
    .data(stdWindows)
    .enter().append('rect')
    .attr('class', function (d) {
      return 'main-item' + d.lane
    })
    .attr('x', function (d) {
      return x(d.start)
    })
    .attr('y', function (d) {
      return y1(d.lane) - (mainRectHeight + mainRectPadding)
    })
    .attr('width', function (d) {
      return x(d.end) - x(d.start)
    })
    .attr('height', mainRectHeight)
    .attr('fill', function (d) {
      return sourceColors(d.id)
    })
    .attr('opacity', 0.6)

  //mini item rects
  mini.append('g').selectAll('.mini-items')
    .data(stdWindows)
    .enter().append('rect')
    .attr('class', function (d) {
      return 'mini-item' + d.lane
    })
    .attr('x', function (d) {
      return x(d.start)
    })
    .attr('y', function (d) {
      return y2(d.lane) - (miniRectHeight + miniRectPadding)
    })
    .attr('width', function (d) {
      return x(d.end) - x(d.start)
    })
    .attr('height', miniRectHeight)
    .attr('fill', function (d) {
      return sourceColors(d.id)
    })
    .attr('opacity', 0.6)

  // mini labels
  // mini.append('g').selectAll('.mini-label')
  //   .data(stdWindows)
  //   .enter().append('text')
  //   .attr('class', function (d) {
  //     return 'mini-label ' + d.lane
  //   })
  //   .text(function (d) {
  //     return d.id
  //   })
  //   .attr('x', function (d) {
  //     return x(d.start)
  //   })
  //   .attr('y', function (d) {
  //     return y2(d.lane)
  //   })
  //   .attr('dy', '2.0ex')

  let timelineLines = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  timelineLines.append('line')
    .attr('x1', dottedLineX)
    .attr('x2', dottedLineX)
    .attr('y1', -dottedLineLength)
    .attr('y2', mainHeight + miniHeight + dottedLineLength)
    .attr('stroke', '#ff7e00')
    .attr('stroke-dasharray', '3,3')
}

function brushChart() {
  function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
  }

  function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
  }

  function display() {
    var selection = d3.event.selection
    // x is the time scale
    // x1 is the length scale
    console.log(selection) // range that you are selecting
    console.log(selection.map(x.invert, x)) // range inverted into time
    console.log(x1.domain(selection.map(x.invert, x))) // set the domain of x1 ..

    // focus.selectAll(".dot")
    //       .attr("cx", function(d) { return x(d.date); })
    //       .attr("cy", function(d) { return y(d.price); });
    // focus.select(".axis--x").call(xAxis);
  }

  let brush = d3.brushX()
  .extent([[dottedLineX, -10], [width - margin.right - 10, miniHeight]])
  .on('brush', display)

  d3.select('.mini')
    .append('g')
    .attr('class', 'brush')
    .call(brush)
    .call(brush.move, [dottedLineX, width - margin.right - 10])
}

d3.json('data/std_windows.json').then(data => {
  data.forEach(d => {
    d.start = moment().add(d.start[0], d.start[1]).toDate()
    d.end = moment().add(d.end[0], d.end[1]).toDate()
  })

  setupCharts(data)
  brushChart()
})

