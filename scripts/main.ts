import { createNode, scaleNode, colorPick, calcDist, contained, moveNode } from './nodes'
import { createVertex, moveVertex, endVertex } from './vertices'
import { dijkstra, nextStep } from './dijkstra'
import { _Node, Vertex } from './classes'

var
  dijkstraButton: HTMLElement,
  nextButton: HTMLElement,
  skipButton: HTMLElement,
  computing = false,
  dStart: number = null,
  dEnd: number = null



window.onload = () => {

  dijkstraButton = document.getElementById('compute')
  nextButton = document.getElementById('step')
  skipButton = document.getElementById('end')

  nextButton.addEventListener('click', () => nextStep())
  skipButton.addEventListener('click', () => { while (nextStep()); })
  dijkstraButton.addEventListener('click', () => toggleDijkstra(!computing))

  let title = <HTMLElement>document.querySelector('h1 span')
  title.addEventListener('mouseover', () => title.style.color = colorPick())
  title.addEventListener('mouseout', () => title.style.color = 'white')
  title.addEventListener('click', () => window.open("https://github.com/dango301/Dijkstra", '_blank'))
  
  console.log("Welcome 🌟🌟🌟")
}


function toggleDijkstra(state: boolean) {

  if (computing == state || (state == undefined && computing == false)) return state
  else computing = state

  dijkstraButton.innerHTML = computing ? 'Waiting for selection of Startpoint...' : 'Find shortest route'
  document.body.id = computing ? 'preparing' : ''
  if (!computing) {
    [...Array.from(document.getElementsByClassName('node')), ...Array.from(document.getElementsByClassName('vertex'))]
      .forEach(el => {
        el.id = ''
        el.classList.remove('shortestPath')
        el.classList.remove('finalPath')
      })
    nextButton.classList.add('inactive')
    skipButton.classList.add('inactive')
    dStart = null
    dEnd = null
    if (state != undefined) console.log("✨✨Ended Dijkstra Search✨✨")
    console.groupEnd()

  } else {
    [...Array.from(document.getElementsByClassName('node')), ...Array.from(document.getElementsByClassName('vertex'))]
      .forEach(el => el.id = 'inactive')
    console.group('%c' + 'Dijkstra Algorithm activated:', 'color: #FF9B42; font-weight: 900; font-style: italic')
  }

  return state
}



var
  cNode: HTMLElement = null,
  origin = { x: 0, y: 0 },
  dragging: HTMLElement = null,
  cVertex: HTMLElement = null,
  deletion = { timeout: null, el: null },
  cancelDeletion = () => {
    try {
      clearTimeout(deletion.timeout)
      deletion.el.classList.remove('deleting')
      deletion = { timeout: null, el: null }
    } catch (err) { console.log(err) }
  }

window.addEventListener('mousedown', mousedown)
window.addEventListener('mousemove', mousemove)
window.addEventListener('mouseup', mouseup)
window.oncontextmenu = () => false


function mousedown(e) {

  let
    src = e.srcElement,
    classes = src.classList,
    x = e.clientX,
    y = e.clientY,
    nodeEl = src.classList.contains('title') ? src.parentElement : src,
    vertexEl = nodeEl.parentNode,
    node = _Node.find(nodeEl)


  if (classes.contains('node') || classes.contains('title') || vertexEl.classList.contains('vertex')) {
    switch (e.button) {

      case 0:
        if (cVertex == null) {

          if (computing) {
            if (dStart == null) {
              dStart = node.id
              nodeEl.id = 'start'
              dijkstraButton.innerHTML = 'Waiting for selection of Endpoint...'
            }
            else if (dEnd == null) {
              dEnd = node.id
              nodeEl.id = 'end'
              document.body.id = 'computing'
              nextButton.classList.remove('inactive')
              skipButton.classList.remove('inactive')
              dijkstraButton.innerHTML = 'Exit Dijkstra Search'
              dijkstra(dStart, dEnd)
            }

          } else {
            dragging = nodeEl
            dragging.classList.add('dragging')
            dragging.firstElementChild.classList.add('dragging')
            moveNode(nodeEl, origin.x, origin.y, x, y)
          }
        }
        return

      case 1:
        if (computing) return
        if (vertexEl.classList.contains('vertex'))
          Vertex.find(vertexEl).delete()
        else {
          nodeEl.classList.add('deleting')
          deletion.timeout = setTimeout(() => {
            try {
              node.delete()
            } catch (err) {
            }
          }, 750)
          deletion.el = nodeEl
        }
        return

      case 2:
        if (dragging == null && !computing)
          cVertex = createVertex(nodeEl, node)
        return
    }
  }

  // setting this block outside of switch statement allows for user to create nodes with any mouse button on any background
  if (cVertex == null && !computing && nodeEl.tagName != 'BUTTON') {
    origin = { x, y }
    cNode = createNode(x, y)
  }
}


var finNodeBlur = e => finalizeNode(e, true)
var finNodeKey = e => finalizeNode(e, false)
function mouseup(e) {

  if (deletion.timeout != null) {
    cancelDeletion()
    return
  }

  if (dragging != null) {
    dragging.classList.remove('dragging')
    dragging.firstElementChild.classList.remove('dragging')
    dragging = null
    return
  }

  let x = e.clientX, y = e.clientY

  if (cNode != null) {

    if (!contained(calcDist(origin.x, origin.y, x, y)))
      document.body.removeChild(cNode)
    else {
      scaleNode(cNode, origin.x, origin.y, x, y)
      let title = <HTMLElement>cNode.firstElementChild
      title.style.width = 'fit-content' //FIXME: not working as intended, input element is vertically huge af
      title.style.height = 'min-content'
      title.focus()
      title.addEventListener('blur', finNodeBlur)
      title.addEventListener('keyup', finNodeKey)

    }
    cNode = null;
  }

  if (cVertex != null) {
    cVertex.setAttribute('data-id', String(Vertex.idCount))
    endVertex(cVertex, e.path)
    cVertex = null
  }
}


function mousemove(e) {

  let x = e.clientX, y = e.clientY

  if (dragging != null) {
    moveNode(dragging, origin.x, origin.y, x, y)
    return
  }

  if (cNode != null)
    scaleNode(cNode, origin.x, origin.y, x, y)

  if (cVertex != null)
    moveVertex(cVertex, x, y)
}


function finalizeNode(event, blurred: boolean) {

  let
    input = event.srcElement,
    val = input.value,
    nodeEl = input.parentNode,
    submitted = event.code == 'Enter'

  if (submitted || blurred) {
    if (val == '') {
      try {
        document.body.removeChild(nodeEl)
      } catch (err) { }
    }
    else {
      input.removeEventListener('blur', finNodeBlur)
      input.removeEventListener('keyup', finNodeKey)
      input.setAttribute('readonly', 'true')
      input.setAttribute('unselectable', 'on')
      nodeEl.setAttribute('data-id', _Node.idCount)

      let x = parseFloat(nodeEl.style.left) + parseFloat(nodeEl.style.width) / 2
      let y = parseFloat(nodeEl.style.top) + parseFloat(nodeEl.style.height) / 2

      console.groupCollapsed('%c' + 'Created new Node', 'color: #EFA8C7;')
      console.log(new _Node(val, x, y, nodeEl))
      console.groupEnd()
    }
  }
}


