let items = [
  {"lane": 0, "id": "Qin", "start": moment().toDate(), "end": moment().add(4, 'weeks').toDate()},
]

let timeStart = moment().toDate(),
  timeEnd = moment().add(52, 'weeks').toDate()

let margin = {
    top: 20,
    right: 30,
    bottom: 30,
    left: 30
  },
  width = 550 - margin.right - margin.left,
  height = 300 - margin.top - margin.bottom
  lanes = ['Chlamydia', 'Gonorrhea', 'Syphilis', 'HIV', 'Hepatitis B'] // names of stds,
  miniHeight = 50, // height of mini brushable timeline
  mainHeight = height - miniHeight - 50 // height of bigger timeline

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

let svg = d3.select('#testing-timeline').append('svg')
  .attr('viewBox', '0 0 ' + width + ' ' + height)
  .attr('class', 'testing-timeline')

svg.append('defs').append('clipPath')
  .attr('id', 'clip')
  .append('rect')
  .attr('width', width)
  .attr('height', mainHeight)

let main = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('width', width)
  .attr('height', mainHeight)
  .attr('class', 'main')

let mini = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + (mainHeight + margin.top) + ')')
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

let miniRectHeight = 5

//mini item rects
mini.append('g').selectAll('.mini-items')
  .data(items)
  .enter().append('rect')
  .attr('class', function (d) {
    return 'mini-item' + d.lane
  })
  .attr('x', function (d) {
    return x(d.start)
  })
  .attr('y', function (d) {
    return y2(d.lane + .5) - (miniRectHeight / 2)
  })
  .attr('width', function (d) {
    return x(d.end) - x(d.start)
  })
  .attr('height', miniRectHeight)

//mini labels
mini.append('g').selectAll('.mini-label')
  .data(items)
  .enter().append('text')
  .attr('class', function (d) {
    return 'mini-label ' + d.lane
  })
  .text(function (d) {
    return d.id
  })
  .attr('x', function (d) {
    return x(d.start)
  })
  .attr('y', function (d) {
    return y2(d.lane + .5)
  })
  // .attr('dy', '2.0ex')