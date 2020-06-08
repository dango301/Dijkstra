
class _Node {
  static idCount = 0
  static all: Array<_Node> = []

  public name: string
  private _x: number
  private _y: number
  public id: number
  private _vertices: Set<Vertex>
  private _element: HTMLElement

  constructor(name: string, x: number, y: number, element: HTMLElement) {
    this.name = name
    this._x = x
    this._y = y
    this._element = element
    this.id = _Node.idCount++
    this._vertices = new Set()
    _Node.all.push(this)


  }

  static find = (el: HTMLElement) => _Node.all[parseInt(el.getAttribute('data-id'))]

  get x() {
    return this._x
  }
  set x(x: number) {
    this._x = x
  }

  get y() {
    return this._y
  }
  set y(y: number) {
    this._y = y
  }

  get element() {
    return this._element
  }

  get vertices() {
    return Array.from(this._vertices.values())
  }

  addVertex(el: HTMLElement, node: _Node) {

    let
      vals = this.vertices,
      dups = vals.filter(v => v.end == node),
      vertex = new Vertex(el, this, node)

    if (dups.length > 0 || node == this) return undefined

    this._vertices.add(vertex)
    node.addVertexToOpposite(vertex)
    return vertex
  }
  addVertexToOpposite(v: Vertex) {
    this._vertices.add(v)
  }
  removeVertex(v: Vertex) {
    this._vertices.delete(v)
  }

  delete() {
    delete _Node.all[this.id]
    document.body.removeChild(this.element)
    this.vertices.forEach(v => v.delete())
  }
}


class SearchNode {
  public name: string
  public id: number
  public element: HTMLElement
  private _distance = Infinity
  private _origin: SearchNode = undefined
  private _paths: Set<SearchVertex> = new Set()
  private _visited = false

  constructor(node: _Node) {
    this.name = node.name
    this.id = node.id
    this.element = node.element
  }

  get distance() {
    return this._distance
  }
  set distance(distance: number) {
    this._distance = distance
  }
  get origin() {
    return this._origin
  }
  set origin(node: SearchNode) {
    this._origin = node
  }
  get visited() {
    return this._visited
  }
  set visited(state: boolean) {
    this._visited = state
  }

  get paths() {
    return Array.from(this._paths.values())
  }
  setPaths(vertices: Array<Vertex>, allNodes: Array<SearchNode>) {

    vertices
      .filter(vertex => vertex.start.id == this.id)
      .forEach(vertex => {
        let end = allNodes.find(node => node.id == vertex.end.id)
        this._paths.add(new SearchVertex(vertex, end))
      })
  }
}


class Vertex {
  static idCount = 0
  static all: Array<Vertex> = []

  element: HTMLElement
  start: _Node
  end: _Node
  id: number

  constructor(element: HTMLElement, start: _Node, end: _Node) {
    this.element = element
    this.start = start
    this.end = end
    this.id = Vertex.idCount++
    Vertex.all.push(this)
  }

  static find = (el: HTMLElement) => Vertex.all[parseInt(el.getAttribute('data-id'))]

  delete() {
    delete Vertex.all[this.id]
    document.body.removeChild(this.element)
    this.start.removeVertex(this)
    this.end.removeVertex(this)
  }
}


class SearchVertex {
  element: HTMLElement
  end: SearchNode // no start needed since outwards directed vertices only
  distance: number

  constructor(vertex: Vertex, end: SearchNode) {
    this.element = vertex.element
    this.end = end
    this.distance = Math.round(parseFloat(vertex.element.style.width))
  }
}



export {
  _Node,
  Vertex,
  SearchNode
}