import { _Node } from './classes'

var cNode: _Node = null
var calcDist = (ox: number, oy: number, x2: number, y2: number) => Math.hypot(x2 - ox, y2 - oy)



function createVertex(el: HTMLElement, node: _Node) {
  if (node == undefined) return

  let v = document.createElement('div')
  let s = document.createElement('p')
  cNode = node

  v.classList.add('vertex')
  v.style.left = `${node.x}px`
  v.style.top = `${node.y}px`

  v.appendChild(s)
  document.body.appendChild(v)
  return v
}


function moveVertex(v: HTMLElement, x: number, y: number, node = undefined) {

  let
    textEl = <HTMLElement>v.firstElementChild,
    x2 = node == undefined ? parseFloat(v.style.left) : node.x,
    y2 = node == undefined ? parseFloat(v.style.top) : node.y,
    hypo = calcDist(x2, y2, x, y),
    radians = -Math.atan2(x2 - x, y2 - y),
    alpha = radians * (180 / Math.PI) - 90

  if (node != undefined) {
    v.style.left = `${x2}px`
    v.style.top = `${y2}px`
  }

  v.style.width = `${hypo}px`
  v.style.transform = `rotate(${alpha}deg)`

  let str = Math.round(hypo)
  textEl.innerHTML = alpha > -90 ? '➡ ' + str : str + ' ⬅'
  textEl.style.transform = alpha < -90 ? 'rotate(180deg)' : 'rotate(0)'
}


function endVertex(v: HTMLElement, path: Array<HTMLElement>) {

  let el = path.find(e => {
    if (e.classList == undefined) return false
    return e.classList.contains('node')
  })

  if (el != undefined) {
    let target = _Node.find(el)
    let vertex = cNode.addVertex(v, target)
    moveVertex(v, target.x, target.y)

    if (vertex != undefined) {

      console.groupCollapsed('%c' + 'Created new Vertex', 'color: #2A9D8F;')
      console.log('Emitter:', cNode)
      console.log('Target:', cNode)
      console.log('Vertex:', vertex)
      console.groupEnd()
    } else
      document.body.removeChild(v)

  } else
    document.body.removeChild(v)

  cNode = null
}



export {
  createVertex,
  moveVertex,
  endVertex
}