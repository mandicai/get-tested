let numberWeeks = 24

let timeStart = moment().toDate(),
  timeEnd = moment().add(numberWeeks, 'weeks').toDate()

let margin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 40
  },
  width = 550 - margin.right - margin.left,
  height = 350 - margin.top - margin.bottom
  lanes = ['Chlamydia', 'Gonorrhea', 'Syphilis', 'HIV', 'Hepatitis A', 'Hepatitis B', 'Hepatitis C', 'Oral Herpes', ' Genital Herpes', 'Trichomoniasis', 'HPV'] // names of stds,
  miniHeight = 75, // height of mini brushable timeline
  mainHeight = height - miniHeight - 50 // height of bigger timeline,
  miniRectHeight = 5 // height of each window in the mini timeline

// scales
let x = d3.scaleTime()
  .domain([timeStart, timeEnd])
  .range([margin.left, width])

let x1 = d3.scaleLinear()
  .range([0, width])

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
    .attr('dx', 414)
    .text(numberWeeks + ' weeks')
    .attr('font-size', '7px')

  let main = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width)
    .attr('height', mainHeight)
    .attr('class', 'main')

  let mini = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + (mainHeight + margin.top + 15) + ')')
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
    .attr('x2', width)
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
    .attr('x', margin.right - 5)
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
    .attr('x2', width)
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
    .attr('x', margin.right - 5)
    .attr('y', function (d, i) {
      return y2(i)
    })
    .attr('dy', '.1ex')
    .attr('text-anchor', 'end')
    .attr('class', 'lane-text mini')

  let itemRects = main.append('g')
    .attr('clip-path', 'url(#clip)')

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
      return y2(d.lane) - (miniRectHeight + 1)
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
    .attr('transform', 'translate(' + margin.right + ',' + margin.top + ')')

  timelineLines.append('line')
    .attr('x1', margin.left)
    .attr('x2', margin.left)
    .attr('y1', -margin.top + 12)
    .attr('y2', mainHeight + miniHeight + 15)
    .attr('stroke', '#ff7e00')
    .attr('stroke-dasharray', '3,3')
}

d3.json('data/std_windows.json').then(data => {
  data.forEach(d => {
    d.start = moment().add(d.start[0], d.start[1]).toDate()
    d.end = moment().add(d.end[0], d.end[1]).toDate()
  })

  setupCharts(data)
})

