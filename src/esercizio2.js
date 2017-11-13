// Vertex shader program
const vertexShaderSource = `
  attribute vec4 a_Position;   // Vertex coordinates
  attribute vec4 a_Color;      // Vertex Color
  uniform mat4 u_MvpMatrix;    // Model-View-Projection Matrix
  varying vec4 v_Color;        // vertex color

  void main() {
    gl_Position = u_MvpMatrix * a_Position;
    v_Color = a_Color;
  }
`

// Fragment shader program
const fragmentShaderSource = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  varying vec4 v_Color;

  void main() {
    gl_FragColor = v_Color;
  }
`

const main = () => {
  // Retrieve <canvas> element
  const canvas = document.querySelector('canvas#webgl-es2')

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas)
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL')
    return
  }

  // Initialize shaders
  if (!initShaders(gl, vertexShaderSource, fragmentShaderSource)) {
    console.log('Failed to intialize shaders.')
    return
  }

  const n = initVertexBuffers(gl)
  if (n < 0) {
    console.log('Failed to set the vertex information')
    return
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0, 0, 0, 1)
  gl.enable(gl.DEPTH_TEST)

  // Get the storage locations of uniform variables and so on
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
  if (!u_MvpMatrix) {
    console.log('Failed to get the storage location')
    return
  }

  let vpMatrix = new Matrix4() // View projection matrix
  const camPos = new Vector3([0.0, 3.0, 6.0])

  // Calculate the view projection matrix
  vpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000)
  vpMatrix.lookAt(...camPos.elements, 0, 0, 0, 0, 1, 0)

  let currentAngle = 0.0 // Current rotation angle
  const modelMatrix = new Matrix4() // Model matrix
  const mvpMatrix = new Matrix4() // Model view projection matrix

  //*********************************************************************
  // creo una GUI con dat.gui
  const gui = new dat.GUI()
  // checkbox geometry
  let geometria = { cube: true, cone: false, cylinder: false, sphere: false, torus: false }
  // color selector
  let colore = { color0: [255, 0, 0] }

  gui.addColor(colore, 'color0').onFinishChange(value => {
    console.log(value)
    colore = { color0: value }
  })

  gui.add(geometria, 'cube').onFinishChange(value => {
    // Fires when a controller loses focus.
    if (value === true) {
      geometria.cube = value
      geometria.cone = false
      geometria.cylinder = false
      geometria.sphere = false
      geometria.torus = false
    }

    // Iterate over all controllers
    for (let ctrl of gui.__controllers) {
      ctrl.updateDisplay()
    }
  })

  gui.add(geometria, 'cone').onFinishChange(value => {
    // Fires when a controller loses focus.
    if (value == true) {
      geometria.cube = false
      geometria.cone = value
      geometria.cylinder = false
      geometria.sphere = false
      geometria.torus = false
    }

    // Iterate over all controllers
    for (let ctrl of gui.__controllers) {
      ctrl.updateDisplay()
    }
  })

  gui.add(geometria, 'cylinder').onFinishChange(value => {
    // Fires when a controller loses focus.
    if (value == true) {
      geometria.cube = false
      geometria.cone = false
      geometria.cylinder = value
      geometria.sphere = false
      geometria.torus = false
    }

    // Iterate over all controllers
    for (let ctrl of gui.__controllers) {
      ctrl.updateDisplay()
    }
  })

  gui.add(geometria, 'sphere').onFinishChange(value => {
    // Fires when a controller loses focus.
    if (value == true) {
      geometria.cube = false
      geometria.cone = false
      geometria.cylinder = false
      geometria.sphere = value
      geometria.torus = false
    }

    // Iterate over all controllers
    for (let ctrl of gui.__controllers) {
      ctrl.updateDisplay()
    }
  })

  gui.add(geometria, 'torus').onFinishChange(value => {
    // Fires when a controller loses focus.
    if (value == true) {
      geometria.cube = false
      geometria.cone = false
      geometria.cylinder = false
      geometria.sphere = false
      geometria.torus = value
    }

    // Iterate over all controllers
    for (let ctrl of gui.__controllers) {
      ctrl.updateDisplay()
    }
  })

  //*********************************************************************************
  const tick = () => {
    // read geometria
    for (let geom in geometria) {
      if (geom == true) {
        console.log(geom)
      }
    }

    currentAngle = animate(currentAngle) // Update the rotation angle
    // Calculate the model matrix
    modelMatrix.setRotate(currentAngle, 0, 1, 0) // Rotate around the y-axis

    mvpMatrix.set(vpMatrix).multiply(modelMatrix)
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Draw the cube
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)

    requestAnimationFrame(tick, canvas) // Request that the browser ?calls tick
  }
  tick()
}

const initVertexBuffers = gl => {
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
  const vertices = new Float32Array([
    1.0, 1.0, 1.0,   -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,  1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
    1.0, 1.0, 1.0,   1.0, 1.0,-1.0,   -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,  1.0,-1.0,-1.0,   1.0,-1.0, 1.0,   -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
    1.0,-1.0,-1.0,   -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,  1.0, 1.0,-1.0   // v4-v7-v6-v5 back
  ]);

  // Colors
  // prettier-ignore
  const colors = new Float32Array([
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0      // v4-v7-v6-v5 back
  ]);

  // Indices of the vertices
  // prettier-ignore
  const indices = new Uint8Array([
    0,  1,  2,   0, 2,  3,     // front
    4,  5,  6,   4, 6,  7,     // right
    8,  9,  10,  8, 10, 11,    // up
    12, 13, 14, 12, 14, 15,    // left
    16, 17, 18, 16, 18, 19,    // down
    20, 21, 22, 20, 22, 23     // back
  ]);

  // Write the vertex property to buffers (coordinates, colors and normals)
  if (!initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1
  if (!initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT)) return -1

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  // Write the indices to the buffer object
  let indexBuffer = gl.createBuffer()
  if (!indexBuffer) {
    console.log('Failed to create the buffer object')
    return false
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  return indices.length
}

const initArrayBuffer = (gl, attribute, data, num, type) => {
  // Create a buffer object
  let buffer = gl.createBuffer()
  if (!buffer) {
    console.log('Failed to create the buffer object')
    return false
  }

  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute)
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute)
    return false
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0)
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute)
  return true
}

// Rotation angle (degrees/second)
const ANGLE_STEP = 5.0

// Last time that this function was called
let g_last = Date.now()

const animate = angle => {
  // Calculate the elapsed time
  let now = Date.now()
  const elapsed = now - g_last
  g_last = now

  // Update the current rotation angle (adjusted by the elapsed time)
  let newAngle = angle + ANGLE_STEP * elapsed / 1000.0
  return (newAngle %= 360)
}

main()
