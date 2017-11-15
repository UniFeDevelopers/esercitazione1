'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Vertex shader program
var vertexShaderSource = '\n  attribute vec4 a_Position;   // Vertex coordinates\n  attribute vec4 a_Color;      // Vertex Color\n  uniform mat4 u_MvpMatrix;    // Model-View-Projection Matrix\n  varying vec4 v_Color;        // vertex color\n\n  void main() {\n    gl_Position = u_MvpMatrix * a_Position;\n    v_Color = a_Color;\n  }\n';

// Fragment shader program
var fragmentShaderSource = '\n  #ifdef GL_ES\n  precision mediump float;\n  #endif\n  varying vec4 v_Color;\n\n  void main() {\n    gl_FragColor = v_Color;\n  }\n';

var Shape = function Shape() {
  _classCallCheck(this, Shape);

  this.vertices = [];
  this.colors = [];
  this.indices = [];
};

var Cone = function (_Shape) {
  _inherits(Cone, _Shape);

  function Cone(nDiv, radius, height, color) {
    var _this$vertices, _this$colors, _this$vertices2, _this$colors2;

    _classCallCheck(this, Cone);

    var _this = _possibleConstructorReturn(this, (Cone.__proto__ || Object.getPrototypeOf(Cone)).call(this));

    var numberVertices = nDiv + 2;
    var angleStep = 2 * Math.PI / nDiv;
    var centre = [0.0, 0.0, 0.0];
    var top = [0.0, height, 0.0];

    (_this$vertices = _this.vertices).push.apply(_this$vertices, centre);
    (_this$colors = _this.colors).push.apply(_this$colors, _toConsumableArray(color));

    (_this$vertices2 = _this.vertices).push.apply(_this$vertices2, top);
    (_this$colors2 = _this.colors).push.apply(_this$colors2, _toConsumableArray(color));

    // GENERO TUTTI I VERTICI.
    for (var i = 2, angle = 0; i < numberVertices; i++, angle += angleStep) {
      var _this$colors3;

      var x = Math.cos(angle) * radius;
      var z = Math.sin(angle) * radius;
      var y = centre[1];

      _this.vertices.push(x, y, z);
      (_this$colors3 = _this.colors).push.apply(_this$colors3, _toConsumableArray(color));

      // COLLEGO IL CENTRO AL TOP ED AL NOSTRO VERTICE.
      _this.indices.push(0, 1, i);

      if (i < numberVertices - 1) {
        // OSSIA COLLEGO IL CENTRO, IL NOSTRO VERTICE, E QUELLO SUCCESSIVO.
        _this.indices.push(0, i, i + 1);
      } else {
        //OSSIA COLLEGO IL CENTRO, IL NOSTRO VERTICE, E IL PRIMO VERTICE DELLA CIRCONFERENZA.
        _this.indices.push(0, i, 2);
      }
    }
    return _this;
  }

  return Cone;
}(Shape);

var Cube = function (_Shape2) {
  _inherits(Cube, _Shape2);

  function Cube() {
    _classCallCheck(this, Cube);

    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    // Coordinates

    // prettier-ignore
    var _this2 = _possibleConstructorReturn(this, (Cube.__proto__ || Object.getPrototypeOf(Cube)).call(this));

    _this2.vertices = [1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, // v0-v1-v2-v3 front
    1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, // v0-v3-v4-v5 right
    1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, // v1-v6-v7-v2 left
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, // v7-v4-v3-v2 down
    1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0 // v4-v7-v6-v5 back
    ];

    // Colors
    // prettier-ignore
    _this2.colors = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v0-v1-v2-v3 front
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v0-v3-v4-v5 right
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v0-v5-v6-v1 up
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v1-v6-v7-v2 left
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v7-v4-v3-v2 down
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0 // v4-v7-v6-v5 back
    ];

    // Indices of the vertices
    // prettier-ignore
    _this2.indices = [0, 1, 2, 0, 2, 3, // front
    4, 5, 6, 4, 6, 7, // right
    8, 9, 10, 8, 10, 11, // up
    12, 13, 14, 12, 14, 15, // left
    16, 17, 18, 16, 18, 19, // down
    20, 21, 22, 20, 22, 23 // back
    ];
    return _this2;
  }

  return Cube;
}(Shape);

var main = function main() {
  // Retrieve <canvas> element
  var canvas = document.querySelector('canvas#webgl-es2');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, vertexShaderSource, fragmentShaderSource)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables and so on
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if (!u_MvpMatrix) {
    console.log('Failed to get the storage location');
    return;
  }

  var vpMatrix = new Matrix4(); // View projection matrix
  var camPos = new Vector3([0.0, -2.0, 7.0]);

  // Calculate the view projection matrix
  vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000);
  vpMatrix.lookAt.apply(vpMatrix, _toConsumableArray(camPos.elements).concat([0, 0, 0, 0, 1, 0]));

  var currentAngle = 0.0; // Current rotation angle
  var modelMatrix = new Matrix4(); // Model matrix
  var mvpMatrix = new Matrix4(); // Model view projection matrix

  //*********************************************************************
  // creo una GUI con dat.gui
  var gui = new dat.GUI();
  // checkbox geometry
  var geometria = { cube: true, cone: false, cylinder: false, sphere: false, torus: false
    // color selector
  };var colore = { color0: [255, 0, 0] };

  gui.addColor(colore, 'color0').onFinishChange(function (value) {
    console.log(value);
    colore = { color0: value };
  });

  gui.add(geometria, 'cube').onFinishChange(function (value) {
    // Fires when a controller loses focus.
    if (value === true) {
      geometria.cube = value;
      geometria.cone = false;
      geometria.cylinder = false;
      geometria.sphere = false;
      geometria.torus = false;
    }

    // Iterate over all controllers
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = gui.__controllers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var ctrl = _step.value;

        ctrl.updateDisplay();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });

  gui.add(geometria, 'cone').onFinishChange(function (value) {
    // Fires when a controller loses focus.
    if (value == true) {
      geometria.cube = false;
      geometria.cone = value;
      geometria.cylinder = false;
      geometria.sphere = false;
      geometria.torus = false;
    }

    // Iterate over all controllers
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = gui.__controllers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var ctrl = _step2.value;

        ctrl.updateDisplay();
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  });

  gui.add(geometria, 'cylinder').onFinishChange(function (value) {
    // Fires when a controller loses focus.
    if (value == true) {
      geometria.cube = false;
      geometria.cone = false;
      geometria.cylinder = value;
      geometria.sphere = false;
      geometria.torus = false;
    }

    // Iterate over all controllers
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = gui.__controllers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var ctrl = _step3.value;

        ctrl.updateDisplay();
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  });

  gui.add(geometria, 'sphere').onFinishChange(function (value) {
    // Fires when a controller loses focus.
    if (value == true) {
      geometria.cube = false;
      geometria.cone = false;
      geometria.cylinder = false;
      geometria.sphere = value;
      geometria.torus = false;
    }

    // Iterate over all controllers
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = gui.__controllers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var ctrl = _step4.value;

        ctrl.updateDisplay();
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }
  });

  gui.add(geometria, 'torus').onFinishChange(function (value) {
    // Fires when a controller loses focus.
    if (value == true) {
      geometria.cube = false;
      geometria.cone = false;
      geometria.cylinder = false;
      geometria.sphere = false;
      geometria.torus = value;
    }

    // Iterate over all controllers
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = gui.__controllers[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var ctrl = _step5.value;

        ctrl.updateDisplay();
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }
  });

  //*********************************************************************************
  var tick = function tick() {
    // read geometria
    for (var geom in geometria) {
      if (geom === true) {
        console.log(geom);
      }
    }

    currentAngle = animate(currentAngle); // Update the rotation angle
    // Calculate the model matrix
    modelMatrix.setRotate(currentAngle, 1, 0, 0); // Rotate around the y-axis

    mvpMatrix.set(vpMatrix).multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw the cube
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(tick, canvas); // Request that the browser ?calls tick
  };
  tick();
};

var initVertexBuffers = function initVertexBuffers(gl) {
  /*
  const shape = new Cone(200, 1, 2, [0.0, 1.0, 0.0])
  */
  debugger;
  var shape = new Cube();
  var vertices = new Float32Array(shape.vertices);
  var indices = new Uint8Array(shape.indices);
  var colors = new Float32Array(shape.colors);

  // Write the vertex property to buffers (coordinates, colors and normals)
  if (!initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1;
  if (!initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT)) return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
};

var initArrayBuffer = function initArrayBuffer(gl, attribute, data, num, type) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }

  // Write data into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  // verticesColor
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);
  return true;
};

// Rotation angle (degrees/second)
var ANGLE_STEP = 5.0;

// Last time that this function was called
var g_last = Date.now();

var animate = function animate(angle) {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;

  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + ANGLE_STEP * elapsed / 1000.0;
  return newAngle %= 360;
};

main();