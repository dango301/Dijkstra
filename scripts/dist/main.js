// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"classes.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Node =
/** @class */
function () {
  function _Node(name, x, y, element) {
    this.name = name;
    this._x = x;
    this._y = y;
    this._element = element;
    this.id = _Node.idCount++;
    this._vertices = new Set();

    _Node.all.push(this);
  }

  Object.defineProperty(_Node.prototype, "x", {
    get: function get() {
      return this._x;
    },
    set: function set(x) {
      this._x = x;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(_Node.prototype, "y", {
    get: function get() {
      return this._y;
    },
    set: function set(y) {
      this._y = y;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(_Node.prototype, "element", {
    get: function get() {
      return this._element;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(_Node.prototype, "vertices", {
    get: function get() {
      return Array.from(this._vertices.values());
    },
    enumerable: true,
    configurable: true
  });

  _Node.prototype.addVertex = function (el, node) {
    var vals = this.vertices,
        dups = vals.filter(function (v) {
      return v.end == node;
    }),
        vertex = new Vertex(el, this, node);
    if (dups.length > 0 || node == this) return undefined;

    this._vertices.add(vertex);

    node.addVertexToOpposite(vertex);
    return vertex;
  };

  _Node.prototype.addVertexToOpposite = function (v) {
    this._vertices.add(v);
  };

  _Node.prototype.removeVertex = function (v) {
    this._vertices.delete(v);
  };

  _Node.prototype.delete = function () {
    delete _Node.all[this.id];
    document.body.removeChild(this.element);
    this.vertices.forEach(function (v) {
      return v.delete();
    });
  };

  _Node.idCount = 0;
  _Node.all = [];

  _Node.find = function (el) {
    return _Node.all[parseInt(el.getAttribute('data-id'))];
  };

  return _Node;
}();

exports._Node = _Node;

var SearchNode =
/** @class */
function () {
  function SearchNode(node) {
    this._distance = Infinity;
    this._origin = undefined;
    this._paths = new Set();
    this._visited = false;
    this.name = node.name;
    this.id = node.id;
    this.element = node.element;
  }

  Object.defineProperty(SearchNode.prototype, "distance", {
    get: function get() {
      return this._distance;
    },
    set: function set(distance) {
      this._distance = distance;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(SearchNode.prototype, "origin", {
    get: function get() {
      return this._origin;
    },
    set: function set(node) {
      this._origin = node;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(SearchNode.prototype, "visited", {
    get: function get() {
      return this._visited;
    },
    set: function set(state) {
      this._visited = state;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(SearchNode.prototype, "paths", {
    get: function get() {
      return Array.from(this._paths.values());
    },
    enumerable: true,
    configurable: true
  });

  SearchNode.prototype.setPaths = function (vertices, allNodes) {
    var _this = this;

    vertices.filter(function (vertex) {
      return vertex.start.id == _this.id;
    }).forEach(function (vertex) {
      var end = allNodes.find(function (node) {
        return node.id == vertex.end.id;
      });

      _this._paths.add(new SearchVertex(vertex, end));
    });
  };

  return SearchNode;
}();

exports.SearchNode = SearchNode;

var Vertex =
/** @class */
function () {
  function Vertex(element, start, end) {
    this.element = element;
    this.start = start;
    this.end = end;
    this.id = Vertex.idCount++;
    Vertex.all.push(this);
  }

  Vertex.prototype.delete = function () {
    delete Vertex.all[this.id];
    document.body.removeChild(this.element);
    this.start.removeVertex(this);
    this.end.removeVertex(this);
  };

  Vertex.idCount = 0;
  Vertex.all = [];

  Vertex.find = function (el) {
    return Vertex.all[parseInt(el.getAttribute('data-id'))];
  };

  return Vertex;
}();

exports.Vertex = Vertex;

var SearchVertex =
/** @class */
function () {
  function SearchVertex(vertex, end) {
    this.element = vertex.element;
    this.end = end;
    this.distance = Math.round(parseFloat(vertex.element.style.width));
  }

  return SearchVertex;
}();
},{}],"vertices.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var classes_1 = require("./classes");

var cNode = null;

var calcDist = function calcDist(ox, oy, x2, y2) {
  return Math.hypot(x2 - ox, y2 - oy);
};

function createVertex(el, node) {
  if (node == undefined) return;
  var v = document.createElement('div');
  var s = document.createElement('p');
  cNode = node;
  v.classList.add('vertex');
  v.style.left = node.x + "px";
  v.style.top = node.y + "px";
  v.appendChild(s);
  document.body.appendChild(v);
  return v;
}

exports.createVertex = createVertex;

function moveVertex(v, x, y, node) {
  if (node === void 0) {
    node = undefined;
  }

  var textEl = v.firstElementChild,
      x2 = node == undefined ? parseFloat(v.style.left) : node.x,
      y2 = node == undefined ? parseFloat(v.style.top) : node.y,
      hypo = calcDist(x2, y2, x, y),
      radians = -Math.atan2(x2 - x, y2 - y),
      alpha = radians * (180 / Math.PI) - 90;

  if (node != undefined) {
    v.style.left = x2 + "px";
    v.style.top = y2 + "px";
  }

  v.style.width = hypo + "px";
  v.style.transform = "rotate(" + alpha + "deg)";
  var str = Math.round(hypo);
  textEl.innerHTML = alpha > -90 ? '➡ ' + str : str + ' ⬅';
  textEl.style.transform = alpha < -90 ? 'rotate(180deg)' : 'rotate(0)';
}

exports.moveVertex = moveVertex;

function endVertex(v, path) {
  var el = path.find(function (e) {
    if (e.classList == undefined) return false;
    return e.classList.contains('node');
  });

  if (el != undefined) {
    var target = classes_1._Node.find(el);

    var vertex = cNode.addVertex(v, target);
    moveVertex(v, target.x, target.y);

    if (vertex != undefined) {
      console.groupCollapsed('%c' + 'Created new Vertex', 'color: #2A9D8F;');
      console.log('Emitter:', cNode);
      console.log('Target:', cNode);
      console.log('Vertex:', vertex);
      console.groupEnd();
    } else document.body.removeChild(v);
  } else document.body.removeChild(v);

  cNode = null;
}

exports.endVertex = endVertex;
},{"./classes":"classes.ts"}],"nodes.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var vertices_1 = require("./vertices");

var classes_1 = require("./classes");

var colors = ['#8B61AA', '#D295BF', '#FB976F', '#dc6d6d', '#FF9B42', '#007AAF', '#2C5CC3', '#e63946', '#2a9d8f', '#26A57B', '#ff006e', '#ff595e'],
    calcDist = function calcDist(ox, oy, x2, y2) {
  return Math.hypot(x2 - ox, y2 - oy);
},
    contained = function contained(dist) {
  return 25 < dist && dist < 125;
};

exports.calcDist = calcDist;
exports.contained = contained;

function createNode(x, y) {
  var node = document.createElement('div'),
      title = document.createElement('input');
  title.setAttribute('type', 'text');
  title.setAttribute('maxlength', '20');
  title.setAttribute('required', 'true');
  title.setAttribute('autofocus', 'true');
  title.setAttribute('autocomplete', 'off');
  title.setAttribute('spellcheck', 'false');
  title.classList.add('title');
  node.classList.add('node');
  node.appendChild(title);
  node.style.background = colors[Math.floor(Math.random() * colors.length)];
  node.style.left = x + "px";
  node.style.top = y + "px";
  document.body.appendChild(node);
  return node;
}

exports.createNode = createNode;

function scaleNode(node, ox, oy, x, y) {
  var title = node.firstElementChild,
      dist = calcDist(ox, oy, x, y),
      nx = ox - dist,
      ny = oy - dist;
  node.style.opacity = contained(dist) ? '1' : '.5';
  node.style.width = 2 * dist + "px";
  node.style.height = 2 * dist + "px";
  node.style.left = nx + "px";
  node.style.top = ny + "px";
  title.style.width = 2 * dist + "px";
  title.style.height = 2 * dist + "px";
  title.setAttribute('placeholder', contained(dist) ? 'name' : '❌');
}

exports.scaleNode = scaleNode;

function moveNode(nodeEl, ox, oy, x, y) {
  var node = classes_1._Node.find(nodeEl),
      nx = x - parseFloat(nodeEl.style.width) / 2,
      ny = y - parseFloat(nodeEl.style.height) / 2;

  nodeEl.style.left = nx + "px";
  nodeEl.style.top = ny + "px";
  if (node == undefined) return;
  node.x = x;
  node.y = y;
  node.vertices.forEach(function (v) {
    if (v.start == node) vertices_1.moveVertex(v.element, v.end.x, v.end.y, node);else vertices_1.moveVertex(v.element, x, y);
  });
}

exports.moveNode = moveNode;
},{"./vertices":"vertices.ts","./classes":"classes.ts"}],"dijkstra.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var classes_1 = require("./classes");

var allNodes,
    cue,
    // priority cue
start,
    end,
    prev,
    compare = function compare(a, b) {
  var d1 = a.distance,
      d2 = b.distance;
  return d1 == d2 ? 0 : d1 > d2 ? 1 : -1;
},
    logCue = function logCue(sn) {
  console.groupCollapsed('%c' + ("Cue at \"" + sn.name + "\":"), 'color: #EECDDC;');
  cue.forEach(function (sn, i) {
    return console.log(i, sn);
  });
  console.groupEnd();
};

function dijkstra(startID, endID) {
  var validNodes = classes_1._Node.all.filter(function (n) {
    return n != undefined;
  }); // filter out deleted elements


  allNodes = validNodes.map(function (n) {
    return new classes_1.SearchNode(n);
  }); // and make SeachNodes out of remaining _Nodes

  start = allNodes.find(function (n) {
    return n.id == startID;
  });
  end = allNodes.find(function (n) {
    return n.id == endID;
  });
  allNodes.forEach(function (sn, i) {
    return sn.setPaths(validNodes[i].vertices, allNodes);
  });
  start.distance = 0;
  cue = [start];
  console.log("\u2705Initialized search for the shortest route between \"" + start.name + "\" and \"" + end.name + "\".");
  console.log({
    allNodes: allNodes,
    start: start,
    end: end
  });
  nextStep();
}

exports.dijkstra = dijkstra;

function nextStep() {
  if (allNodes == undefined) {
    // Dijkstra Search is not activated anymore
    console.log('%c' + "Cue is empty / Dijkstra Search is not active.", 'color: #FF3543;');
    return undefined;
  }

  var cOrigin = cue[0];
  cOrigin.paths.forEach(function (path) {
    return path.element.id = 'active';
  });

  if (prev != undefined) {
    if (prev != start) prev.element.id = '';
    if (cOrigin != end) cOrigin.element.id = 'current';
  }

  cue = processNode();

  if (cOrigin == end || cue.length == 0) {
    // conditions for ending search
    if (cOrigin == end) {
      var finalPath_1 = [cOrigin],
          sum_1 = 0;

      while ((cOrigin = cOrigin.origin) != undefined) {
        finalPath_1.unshift(cOrigin);
      }

      finalPath_1.forEach(function (checkpoint, i) {
        if (i + 1 == finalPath_1.length) return;
        var vertex = checkpoint.paths.find(function (path) {
          return path.end == finalPath_1[i + 1];
        });
        sum_1 += vertex.distance;
        vertex.element.classList.add('finalPath');
      });
      console.group('%c' + "🎉🎉🎉 Found shortest Path: " + sum_1 + "units 🎉🎉🎉", 'color: lime;');
      finalPath_1.forEach(function (checkpoint, i) {
        return console.log({
          Step: i,
          Name: checkpoint.name,
          checkpoint: checkpoint
        });
      });
      console.groupEnd();
    } else if (cue.length == 0) console.log('%c' + "💩 There is no existing route.😢", 'color: brown;');

    document.getElementById('step').classList.add('inactive');
    document.getElementById('end').classList.add('inactive');
    prev = undefined;
    allNodes = undefined;
    return false;
  }

  prev = cOrigin;
  logCue(cOrigin);
  return true;
}

exports.nextStep = nextStep;

function processNode() {
  var origin = cue[0];
  origin.visited = true;
  cue.shift();

  var _loop_1 = function _loop_1(el, end_1, dist) {
    if (origin.distance + dist < end_1.distance) {
      //update
      if (end_1.origin != undefined) end_1.origin.paths.find(function (path) {
        return path.end == end_1;
      }).element.classList.remove('shortestPath');
      end_1.distance = origin.distance + dist;
      end_1.origin = origin;
      el.classList.add('shortestPath');
    }

    if (!end_1.visited && !cue.includes(end_1)) cue.push(end_1);
  };

  for (var _i = 0, _a = origin.paths; _i < _a.length; _i++) {
    var _b = _a[_i],
        el = _b.element,
        end_1 = _b.end,
        dist = _b.distance;

    _loop_1(el, end_1, dist);
  }

  return cue.sort(compare);
}
},{"./classes":"classes.ts"}],"main.ts":[function(require,module,exports) {
"use strict";

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var nodes_1 = require("./nodes");

var vertices_1 = require("./vertices");

var dijkstra_1 = require("./dijkstra");

var classes_1 = require("./classes");

var dijkstraButton,
    nextButton,
    skipButton,
    computing = false,
    dStart = null,
    dEnd = null;

window.onload = function () {
  dijkstraButton = document.getElementById('compute');
  nextButton = document.getElementById('step');
  skipButton = document.getElementById('end');
  nextButton.addEventListener('click', function () {
    return dijkstra_1.nextStep();
  });
  skipButton.addEventListener('click', function () {
    while (dijkstra_1.nextStep()) {
      ;
    }
  });
  dijkstraButton.addEventListener('click', function () {
    return toggleDijkstra(!computing);
  });
  console.log("Welcome 🌟🌟🌟");
};

function toggleDijkstra(state) {
  if (computing == state || state == undefined && computing == false) return state;else computing = state;
  dijkstraButton.innerHTML = computing ? 'Waiting for selection of Startpoint...' : 'Find shortest route';
  document.body.id = computing ? 'preparing' : '';

  if (!computing) {
    __spreadArrays(Array.from(document.getElementsByClassName('node')), Array.from(document.getElementsByClassName('vertex'))).forEach(function (el) {
      el.id = '';
      el.classList.remove('shortestPath');
      el.classList.remove('finalPath');
    });

    nextButton.classList.add('inactive');
    skipButton.classList.add('inactive');
    dStart = null;
    dEnd = null;
    if (state != undefined) console.log("✨✨Ended Dijkstra Search✨✨");
    console.groupEnd();
  } else {
    __spreadArrays(Array.from(document.getElementsByClassName('node')), Array.from(document.getElementsByClassName('vertex'))).forEach(function (el) {
      return el.id = 'inactive';
    });

    console.group('%c' + 'Dijkstra Algorithm activated:', 'color: #FF9B42; font-weight: 900; font-style: italic');
  }

  return state;
}

var cNode = null,
    origin = {
  x: 0,
  y: 0
},
    dragging = null,
    cVertex = null,
    deletion = {
  timeout: null,
  el: null
},
    cancelDeletion = function cancelDeletion() {
  try {
    clearTimeout(deletion.timeout);
    deletion.el.classList.remove('deleting');
    deletion = {
      timeout: null,
      el: null
    };
  } catch (err) {
    console.log(err);
  }
};

window.addEventListener('mousedown', mousedown);
window.addEventListener('mousemove', mousemove);
window.addEventListener('mouseup', mouseup);

window.oncontextmenu = function () {
  return false;
};

function mousedown(e) {
  var src = e.srcElement,
      classes = src.classList,
      x = e.clientX,
      y = e.clientY,
      nodeEl = src.classList.contains('title') ? src.parentElement : src,
      vertexEl = nodeEl.parentNode,
      node = classes_1._Node.find(nodeEl);

  if (classes.contains('node') || classes.contains('title') || vertexEl.classList.contains('vertex')) {
    switch (e.button) {
      case 0:
        if (cVertex == null) {
          if (computing) {
            if (dStart == null) {
              dStart = node.id;
              nodeEl.id = 'start';
              dijkstraButton.innerHTML = 'Waiting for selection of Endpoint...';
            } else if (dEnd == null) {
              dEnd = node.id;
              nodeEl.id = 'end';
              document.body.id = 'computing';
              nextButton.classList.remove('inactive');
              skipButton.classList.remove('inactive');
              dijkstraButton.innerHTML = 'Exit Dijkstra Search';
              dijkstra_1.dijkstra(dStart, dEnd);
            }
          } else {
            dragging = nodeEl;
            dragging.classList.add('dragging');
            dragging.firstElementChild.classList.add('dragging');
            nodes_1.moveNode(nodeEl, origin.x, origin.y, x, y);
          }
        }

        return;

      case 1:
        if (computing) return;
        if (vertexEl.classList.contains('vertex')) classes_1.Vertex.find(vertexEl).delete();else {
          nodeEl.classList.add('deleting');
          deletion.timeout = setTimeout(function () {
            try {
              node.delete();
            } catch (err) {}
          }, 750);
          deletion.el = nodeEl;
        }
        return;

      case 2:
        if (dragging == null && !computing) cVertex = vertices_1.createVertex(nodeEl, node);
        return;
    }
  } // setting this block outside of switch statement allows for user to create nodes with any mouse button on any background


  if (cVertex == null && !computing && nodeEl.tagName != 'BUTTON') {
    origin = {
      x: x,
      y: y
    };
    cNode = nodes_1.createNode(x, y);
  }
}

var finNodeBlur = function finNodeBlur(e) {
  return finalizeNode(e, true);
};

var finNodeKey = function finNodeKey(e) {
  return finalizeNode(e, false);
};

function mouseup(e) {
  if (deletion.timeout != null) {
    cancelDeletion();
    return;
  }

  if (dragging != null) {
    dragging.classList.remove('dragging');
    dragging.firstElementChild.classList.remove('dragging');
    dragging = null;
    return;
  }

  var x = e.clientX,
      y = e.clientY;

  if (cNode != null) {
    if (!nodes_1.contained(nodes_1.calcDist(origin.x, origin.y, x, y))) document.body.removeChild(cNode);else {
      nodes_1.scaleNode(cNode, origin.x, origin.y, x, y);
      var title = cNode.firstElementChild;
      title.style.width = 'fit-content'; //FIXME: not working as intended, input element is vertically huge af

      title.style.height = 'min-content';
      title.focus();
      title.addEventListener('blur', finNodeBlur);
      title.addEventListener('keyup', finNodeKey);
    }
    cNode = null;
  }

  if (cVertex != null) {
    cVertex.setAttribute('data-id', String(classes_1.Vertex.idCount));
    vertices_1.endVertex(cVertex, e.path);
    cVertex = null;
  }
}

function mousemove(e) {
  var x = e.clientX,
      y = e.clientY;

  if (dragging != null) {
    nodes_1.moveNode(dragging, origin.x, origin.y, x, y);
    return;
  }

  if (cNode != null) nodes_1.scaleNode(cNode, origin.x, origin.y, x, y);
  if (cVertex != null) vertices_1.moveVertex(cVertex, x, y);
}

function finalizeNode(event, blurred) {
  var input = event.srcElement,
      val = input.value,
      nodeEl = input.parentNode,
      submitted = event.code == 'Enter';

  if (submitted || blurred) {
    if (val == '') {
      try {
        document.body.removeChild(nodeEl);
      } catch (err) {}
    } else {
      input.removeEventListener('blur', finNodeBlur);
      input.removeEventListener('keyup', finNodeKey);
      input.setAttribute('readonly', 'true');
      input.setAttribute('unselectable', 'on');
      nodeEl.setAttribute('data-id', classes_1._Node.idCount);
      var x = parseFloat(nodeEl.style.left) + parseFloat(nodeEl.style.width) / 2;
      var y = parseFloat(nodeEl.style.top) + parseFloat(nodeEl.style.height) / 2;
      console.groupCollapsed('%c' + 'Created new Node', 'color: #EFA8C7;');
      console.log(new classes_1._Node(val, x, y, nodeEl));
      console.groupEnd();
    }
  }
}
},{"./nodes":"nodes.ts","./vertices":"vertices.ts","./dijkstra":"dijkstra.ts","./classes":"classes.ts"}],"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56013" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.ts"], null)
//# sourceMappingURL=/main.js.map