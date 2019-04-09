let numberWeeks = 28

let timeStart = moment('01-01', 'MM-DD'),
  timeEnd = moment('01-01', 'MM-DD').add(numberWeeks, 'weeks')

let margin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 45
  },
  width = 550,
  height = 300,
  lanes = ['Chlamydia', 'Gonorrhea', 'Syphilis', 'HIV', 'Hepatitis A', 'Hepatitis B', 'Hepatitis C', 'Oral Herpes', ' Genital Herpes', 'Trichomoniasis', 'HPV'], // names of stds
  mainHeight = height - margin.bottom, // height of bigger timeline
  mainRectHeight = 10, // height of each window in the main timeline
  labelSpace = 5, // space between STD labels and charts
  dottedLineX = 30, // x position of dotted line
  dottedLineLength = 20, // extra length of dotted line
  timelineLabelPadding = 6, // padding top of timeline labels
  timelineLabelSpacing = 77, // spacing between timeline labels
  circleRadius = 4, // radius of circles
  headerDecorationRadius = 2, // radius of header decoration circle
  headerDecorationWidth = 300, // width of header decoration
  headerDecorationHeight = 10 // height of header decoration

// scales
let x = d3.scaleTime()
  .domain([timeStart, timeEnd])
  .range([dottedLineX, width - margin.right])

let y1 = d3.scaleLinear()
  .domain([0, lanes.length])
  .range([0, mainHeight])

// color scale
let sourceColors = d3.scaleOrdinal()
  .domain(lanes)
  .range(['rgb(91,88,143)', 'rgb(152,154,202)', 'rgb(35,34,66)', 'rgb(198,103,243)', 'rgb(46,13,147)', 'rgb(251,9,152)', 'rgb(121,35,103)', 'rgb(241,115,177)', 'rgb(45,109,249)', 'rgb(236,130,46)', 'rgb(93,24,0)'])

function setupCharts(stdWindows, container) {
  let svg = d3.select('#' + container).append('svg')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('class', container)

  let timelineLabel = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + timelineLabelPadding + ')')

  timelineLabel.append('text')
    .text('Time of possible contraction')
    .attr('font-size', '8px')

  timelineLabel.append('text')
    .attr('dx', width - timelineLabelSpacing)
    .text(numberWeeks + ' weeks')
    .attr('font-size', '8px')

  // timeline axis and vertical grid lines
  svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + (mainHeight + margin.top - 10) + ')')
    .call(d3.axisBottom(x)
      .tickSize(-mainHeight)
      .tickFormat(d3.timeFormat('%W' + ' weeks'))
    )
    .style('font-size', '8px')

  d3.select('.domain').remove()

  let main = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width)
    .attr('height', mainHeight)
    .attr('class', 'main')

  // lane lines
  main.append('g').selectAll('.lane-lines')
    .data(lanes)
    .enter().append('line')
    .attr('x1', margin.right)
    .attr('y1', (d, i) => {
      return y1(i)
    })
    .attr('x2', width - margin.left)
    .attr('y2', (d, i) => {
      return y1(i)
    })
    .attr('stroke', 'lightgray')

  // lane labels
  main.append('g').selectAll('.lane-text')
    .data(stdWindows)
    .enter().append('text')
    .text(d => {
      return d.id
    })
    .attr('x', margin.right - labelSpace)
    .attr('y', (d, i) => {
      return y1(i)
    })
    .attr('text-anchor', 'end')
    .attr('class', d => {
      return 'lane-text ' + d.id
    })
    .attr('opacity', d => {
      if (container === 'window-timeline') { return sourceColors(d.id) }
      if (container === 'contact-timeline') {
        if (d.skinContact) { return 1 }
        else { return 0.2 }
      }
      if (container === 'symptoms-timeline') { return 1 }
      if (container === 'treatment-timeline') { return 1 }
    })

  //main item windows
  let mainRects = main.append('g').selectAll('.main-item')
    .data(stdWindows)
    .enter().append('g')
    .attr('class', d => {
      return 'main-item ' + d.lane
    })
    .on('mousemove', d => {
      console.log(d)
    })

  mainRects.append('g')
    .attr('transform', d => {
      return 'translate(' + (x(d.end) + 10) + ',' + y1(d.lane) + ')'
    })
    .append('text')
    .text('hi')

  mainRects.append('circle')
    .attr('cx', d => {
      return x(d.start)
    })
    .attr('cy', d => {
      return y1(d.lane) - mainRectHeight
    })
    .attr('r', circleRadius)
    .attr('fill', d => {
      if (container === 'window-timeline') { return sourceColors(d.id) }
      if (container === 'contact-timeline') {
        if (d.skinContact) { return '#ff5027' }
        else { return '#ccc' }
      }
      if (container === 'symptoms-timeline') {
        if (d.lessThanFiftySymptoms === 'both') { return '#830d9b' }
        if (d.lessThanFiftySymptoms === 'women') { return '#fc518e' }
        if (d.lessThanFiftySymptoms === 'men') { return '#0493bf' }
        if (d.lessThanFiftySymptoms === 'neither') { return '#00c1bc' }
      }
      if (container === 'treatment-timeline') {
        if (d.treatmentPlan === 'curable') { return '#02c623'}
        if (d.treatmentPlan === 'treatable') { return '#f96a00'}
      }
    })

  mainRects.append('circle')
    .attr('cx', d => {
      return x(d.end)
    })
    .attr('cy', d => {
      return y1(d.lane) - mainRectHeight
    })
    .attr('r', circleRadius)
    .attr('fill', d => {
      if (container === 'window-timeline') { return sourceColors(d.id) }
      if (container === 'contact-timeline') {
        if (d.skinContact) { return '#ff5027' }
        else { return '#ccc' }
      }
      if (container === 'symptoms-timeline') {
        if (d.lessThanFiftySymptoms === 'both') { return '#830d9b' }
        if (d.lessThanFiftySymptoms === 'women') { return '#fc518e' }
        if (d.lessThanFiftySymptoms === 'men') { return '#0493bf' }
        if (d.lessThanFiftySymptoms === 'neither') { return '#00c1bc' }
      }
      if (container === 'treatment-timeline') {
        if (d.treatmentPlan === 'curable') { return '#02c623'}
        if (d.treatmentPlan === 'treatable') { return '#f96a00'}
      }
    })

  mainRects.append('line')
    .attr('x1', d => {
      return x(d.start)
    })
    .attr('y1', d => {
      return y1(d.lane) - mainRectHeight
    })
    .attr('x2', d => {
      return x(d.end)
    })
    .attr('y2', d => {
      return y1(d.lane) - mainRectHeight
    })
    .attr('stroke', d => {
      if (container === 'window-timeline') { return sourceColors(d.id) }
      if (container === 'contact-timeline') {
        if (d.skinContact) { return '#ff5027' }
        else { return '#ccc' }
      }
      if (container === 'symptoms-timeline') {
        if (d.lessThanFiftySymptoms === 'both') { return '#830d9b' }
        if (d.lessThanFiftySymptoms === 'women') { return '#fc518e' }
        if (d.lessThanFiftySymptoms === 'men') { return '#0493bf' }
        if (d.lessThanFiftySymptoms === 'neither') { return '#00c1bc' }
      }
      if (container === 'treatment-timeline') {
        if (d.treatmentPlan === 'curable') { return '#02c623'}
        if (d.treatmentPlan === 'treatable') { return '#f96a00'}
      }
    })
    .attr('stroke-width', '3px')

  let timelineLines = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  timelineLines.append('line')
    .attr('x1', dottedLineX)
    .attr('x2', dottedLineX)
    .attr('y1', -dottedLineLength)
    .attr('y2', mainHeight - dottedLineLength)
    .attr('stroke', '#ff7e00')
    .attr('stroke-dasharray', '3,3')
}

let contactColorScale = [
  { text: 'Spread skin to skin', color: '#ff5027' },
  { text: 'Spread other ways, i.e. from oral, vaginal, or anal sex', color: '#ccc' }
]
let symptomsColorScale = [
  { text: '< 50% of adults show symptoms', color: '#830d9b' },
  { text: '< 50% of women show symptoms', color: '#fc518e' },
  { text: '< 50% of men show symptoms', color: '#0493bf' },
  { text: 'Most should show symptoms', color: '#00c1bc' },
]
let treatmentColorScale = [
  { text: 'Curable', color: '#02c623' },
  { text: 'Treatable', color: '#f96a00' }
]

function createScale(container, scale) {
  let svgScale = d3.select('#' + container).append('svg')
    .attr('viewBox', '-5 0 ' + width + ' ' + 25)
    .attr('class', container)

  let legend = svgScale.selectAll('.legend')
    .data(scale)
    .enter().append('g')
    .attr('class', 'legend')
    .attr('transform', (d, i) => {
      if (container === 'contact-scale') { return 'translate(' + (i * 100) + ',' + 10 + ')' }
      if (container === 'symptoms-scale') { return 'translate(' + (i * 140) + ',' + 10 + ')' }
      if (container === 'treatment-scale') { return 'translate(' + (i * 50) + ',' + 10 + ')' }
    })

  let legendCircleSize = 5,
    legendX = 10,
    legendY = 2.5

  legend.append('circle')
    .attr('r', legendCircleSize)
    .style('fill', d => d.color)

  legend.append('text')
    .attr('x', legendX)
    .attr('y', legendY)
    .style('font-size', '8px')
    .text(d => d.text)
}

d3.json('data/std_windows_averaged.json').then(data => {
  // convert start and end to moment dates
  data.forEach(d => {
    d.start = moment('01-01', 'MM-DD').add(d.start[0], d.start[1])
    d.end = moment('01-01', 'MM-DD').add(d.end[0], d.end[1])
  })

  // sort data based on start date of window period
  data.sort((a,b) => {
    if (moment(b.start).isBefore(moment(a.start))) {
      return 1
    } else if (moment(b.start).isAfter(moment(a.start))) {
      return -1
    } else if (moment(b.start).isSame(moment(a.start))) {
      return 0
    }
  })

  // change lane number based on new sorted data
  data.forEach((d,i) => {
    d.lane = i
  })

  // add header decoration
  let headerSvg = d3.selectAll('.header-decoration')
    .append('svg')
    .attr('viewBox', '0 0 ' + headerDecorationWidth + ' ' + headerDecorationHeight)

  let headerGroup = headerSvg.append('g')

  headerGroup.append('circle')
    .attr('cx', headerDecorationRadius)
    .attr('cy', headerDecorationHeight / 2)
    .attr('r', headerDecorationRadius)
    .attr('fill', 'pink')

  headerGroup.append('circle')
    .attr('cx', headerDecorationWidth - headerDecorationRadius)
    .attr('cy', headerDecorationHeight / 2)
    .attr('r', headerDecorationRadius)
    .attr('fill', 'pink')

  headerGroup.append('line')
    .attr('x1', headerDecorationRadius)
    .attr('y1', headerDecorationHeight / 2)
    .attr('x2', headerDecorationWidth - headerDecorationRadius)
    .attr('y2', headerDecorationHeight / 2)
    .attr('stroke', 'pink')
    .attr('stroke-width', '1px')

  setupCharts(data, 'window-timeline')
  setupCharts(data, 'contact-timeline')
  setupCharts(data, 'symptoms-timeline')
  setupCharts(data, 'treatment-timeline')
  createScale('contact-scale', contactColorScale)
  createScale('symptoms-scale', symptomsColorScale)
  createScale('treatment-scale', treatmentColorScale)
})
