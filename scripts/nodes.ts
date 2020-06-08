import { moveVertex } from './vertices'
import { _Node, Vertex } from './classes'

var
  colors = [
    '#8B61AA',
    '#D295BF',
    '#FB976F',
    '#dc6d6d',
    '#FF9B42',
    '#007AAF',
    '#2C5CC3',
    '#e63946',
    '#2a9d8f',
    '#26A57B',
    '#ff006e',
    '#ff595e',

  ],
  calcDist = (ox: number, oy: number, x2: number, y2: number) => Math.hypot(x2 - ox, y2 - oy),
  contained = (dist: number) => 25 < dist && dist < 125



function createNode(x: number, y: number) {
  var
    node = document.createElement('div'),
    title = document.createElement('input')

  title.setAttribute('type', 'text')
  title.setAttribute('maxlength', '20')
  title.setAttribute('required', 'true')
  title.setAttribute('autofocus', 'true')
  title.setAttribute('autocomplete', 'off')
  title.setAttribute('spellcheck', 'false')
  title.classList.add('title')

  node.classList.add('node')
  node.appendChild(title)

  node.style.background = colors[Math.floor(Math.random() * colors.length)]
  node.style.left = `${x}px`
  node.style.top = `${y}px`

  document.body.appendChild(node)
  return node
}


function scaleNode(node: HTMLElement, ox: number, oy: number, x: number, y: number) {

  let
    title = <HTMLElement>node.firstElementChild,
    dist = calcDist(ox, oy, x, y),
    nx = ox - dist,
    ny = oy - dist

  node.style.opacity = contained(dist) ? '1' : '.5'
  node.style.width = `${2 * dist}px`
  node.style.height = `${2 * dist}px`
  node.style.left = `${nx}px`
  node.style.top = `${ny}px`

  title.style.width = `${2 * dist}px`
  title.style.height = `${2 * dist}px`
  title.setAttribute('placeholder', contained(dist) ? 'name' : '❌')
}


function moveNode(nodeEl: HTMLElement, ox: number, oy: number, x: number, y: number) {

  let
  node = _Node.find(nodeEl),
    nx = x - parseFloat(nodeEl.style.width) / 2,
    ny = y - parseFloat(nodeEl.style.height) / 2
  nodeEl.style.left = `${nx}px`
  nodeEl.style.top = `${ny}px`

  if (node == undefined) return
  node.x = x
  node.y = y

  node.vertices.forEach((v: Vertex) => {
    if (v.start == node) moveVertex(v.element, v.end.x, v.end.y, node)
    else moveVertex(v.element, x, y)
  })
}



export {
  createNode,
  scaleNode,
  moveNode,
  calcDist,
  contained
}