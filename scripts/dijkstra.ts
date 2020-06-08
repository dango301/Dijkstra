import { _Node, Vertex, SearchNode } from './classes'

var
  allNodes: Array<SearchNode>,
  cue: Array<SearchNode>,  // priority cue
  start: SearchNode,
  end: SearchNode,
  prev: SearchNode,

  compare = (a: SearchNode, b: SearchNode) => {
    let d1 = a.distance, d2 = b.distance
    return d1 == d2 ? 0 : (d1 > d2 ? 1 : -1)
  },
  logCue = (sn: SearchNode) => {
    console.groupCollapsed('%c' + `Cue at "${sn.name}":`, 'color: #EECDDC;')
    cue.forEach((sn, i) => console.log(i, sn))
    console.groupEnd()
  }


function dijkstra(startID: number, endID: number) { // initializes entire search

  let validNodes = _Node.all.filter(n => n != undefined) // filter out deleted elements
  allNodes = validNodes.map(n => new SearchNode(n)) // and make SeachNodes out of remaining _Nodes
  start = allNodes.find(n => n.id == startID)
  end = allNodes.find(n => n.id == endID)

  allNodes.forEach((sn, i) => sn.setPaths(validNodes[i].vertices, allNodes))
  start.distance = 0
  cue = [start]
  console.log(`✅Initialized search for the shortest route between "${start.name}" and "${end.name}".`)
  console.log({ allNodes, start, end })
  nextStep()
}


function nextStep() { // returns true if still searching else false

  if (allNodes == undefined) { // Dijkstra Search is not activated anymore
    console.log('%c' + "Cue is empty / Dijkstra Search is not active.", 'color: #FF3543;')
    return undefined
  }

  let cOrigin = cue[0]
  cOrigin.paths.forEach(path => path.element.id = 'active')
  if (prev != undefined) {
    if (prev != start) prev.element.id = ''
    if (cOrigin != end) cOrigin.element.id = 'current'
  }
  cue = processNode()


  if (cOrigin == end || cue.length == 0) { // conditions for ending search
    if (cOrigin == end) {

      let finalPath = [cOrigin], sum = 0
      while ((cOrigin = cOrigin.origin) != undefined)
        finalPath.unshift(cOrigin)

      finalPath.forEach((checkpoint, i) => {
        if (i + 1 == finalPath.length) return
        let vertex = checkpoint.paths.find(path => path.end == finalPath[i + 1])
        sum += vertex.distance
        vertex.element.classList.add('finalPath')
      })

      console.group('%c' + "🎉🎉🎉 Found shortest Path: " + sum + "units 🎉🎉🎉", 'color: lime;')
      finalPath.forEach((checkpoint, i) => console.log({ Step: i, Name: checkpoint.name, checkpoint }))
      console.groupEnd()

    } else if (cue.length == 0)
      console.log('%c' + "💩 There is no existing route.😢", 'color: brown;')


    document.getElementById('step').classList.add('inactive')
    document.getElementById('end').classList.add('inactive')
    prev = undefined
    allNodes = undefined
    return false
  }

  prev = cOrigin
  logCue(cOrigin)
  return true
}


function processNode() {

  let origin = cue[0]
  origin.visited = true
  cue.shift()

  for (let { element: el, end, distance: dist } of origin.paths) { // classes are objects too! Sexiest object destructuring I've ever applied

    if (origin.distance + dist < end.distance) { //update
      if (end.origin != undefined) end.origin.paths.find(path => path.end == end).element.classList.remove('shortestPath')
      end.distance = origin.distance + dist
      end.origin = origin
      el.classList.add('shortestPath')
    }
    if (!end.visited && !cue.includes(end)) cue.push(end)
  }
  return cue.sort(compare)
}



export {
  dijkstra,
  nextStep
}