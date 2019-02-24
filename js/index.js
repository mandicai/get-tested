let numberWeeks = 28

let timeStart = moment('1/1').toDate(),
  timeEnd = moment('1/1').add(numberWeeks, 'weeks').toDate()

let margin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 40
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
  timelineLabelSpacing = 70, // spacing between timeline labels
  circleRadius = 4 // radius of circles

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

function setupCharts(stdWindows, container, showSkinContact) {
  let svg = d3.select('#' + container).append('svg')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('class', 'window-timeline')

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
    .data(stdWindows)
    .enter().append('text')
    .text(function (d) {
      return d.id
    })
    .attr('x', margin.right - labelSpace)
    .attr('y', function (d, i) {
      return y1(i)
    })
    .attr('text-anchor', 'end')
    .attr('class', 'lane-text main')

  //main item windows
  let mainRects = main.append('g').selectAll('.main-item')
    .data(stdWindows)
    .enter().append('g')
    .attr('class', function (d) {
      return 'main-item ' + d.lane
    })

  mainRects.append('circle')
    .attr('cx', function (d) {
      return x(d.start)
    })
    .attr('cy', function (d) {
      return y1(d.lane) - mainRectHeight
    })
    .attr('r', circleRadius)
    .attr('fill', function (d) {
      if (showSkinContact) {
        if (d.skinContact) {
          return '#ff5027'
        } else {
          return '#ccc'
        }
      } else {
        return sourceColors(d.id)
      }
    })

  mainRects.append('circle')
    .attr('cx', function (d) {
      return x(d.end)
    })
    .attr('cy', function (d) {
      return y1(d.lane) - mainRectHeight
    })
    .attr('r', circleRadius)
    .attr('fill', function (d) {
      if (showSkinContact) {
        if (d.skinContact) {
          return '#ff5027'
        } else {
          return '#ccc'
        }
      } else {
        return sourceColors(d.id)
      }
    })

  mainRects.append('line')
    .attr('x1', function (d) {
      return x(d.start)
    })
    .attr('y1', function (d) {
      return y1(d.lane) - mainRectHeight
    })
    .attr('x2', function (d) {
      return x(d.end)
    })
    .attr('y2', function (d) {
      return y1(d.lane) - mainRectHeight
    })
    .attr('stroke', function (d) {
      if (showSkinContact) {
        if (d.skinContact) {
          return '#ff5027'
        } else {
          return '#ccc'
        }
      } else {
        return sourceColors(d.id)
      }
    })
    .attr('stroke-width', '3px')

  // main labels
  // main.append('g').selectAll('.main-label')
  //   .data(stdWindows)
  //   .enter().append('text')
  //   .attr('class', function (d) {
  //     return 'main-label ' + d.lane
  //   })
  //   .text(function (d) {
  //     console.log(d.start, d.end)
  //     return moment(d.start).week() + ' ' + moment(d.end).week()
  //   })
  //   .attr('x', function (d) {
  //     return x(d.start)
  //   })
  //   .attr('y', function (d) {
  //     return y1(d.lane)
  //   })
  //   .attr('font-size', '8px')

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

d3.json('data/std_windows_averaged.json').then(data => {
  // convert start and end to moment dates
  data.forEach(d => {
    d.start = moment('1/1').add(d.start[0], d.start[1]).toDate()
    d.end = moment('1/1').add(d.end[0], d.end[1]).toDate()
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

  setupCharts(data, 'window-timeline', false)
  setupCharts(data, 'contact-timeline', true)
})

