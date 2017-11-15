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

class Shape {
  constructor() {
    this.vertices = []
    this.colors = []
    this.indices = []
  }
}

class Cone extends Shape {
  constructor(nDiv, radius, height, color) {
    super()

    const numberVertices = nDiv + 2
    const angleStep = 2 * Math.PI / nDiv
    const centre = [0.0, 0.0, 0.0]
    const top = [0.0, height, 0.0]

    this.vertices.push(...centre)
    this.colors.push(...color)

    this.vertices.push(...top)
    this.colors.push(...color)

    // GENERO TUTTI I VERTICI.
    for (let i = 2, angle = 0; i < numberVertices; i++, angle += angleStep) {
      let x = Math.cos(angle) * radius
      let z = Math.sin(angle) * radius
      let y = centre[1]

      this.vertices.push(x, y, z)
      this.colors.push(...color)

      // COLLEGO IL CENTRO AL TOP ED AL NOSTRO VERTICE.
      this.indices.push(0, 1, i)

      if (i < numberVertices - 1) {
        // OSSIA COLLEGO IL CENTRO, IL NOSTRO VERTICE, E QUELLO SUCCESSIVO.
        this.indices.push(0, i, i + 1)
      } else {
        //OSSIA COLLEGO IL CENTRO, IL NOSTRO VERTICE, E IL PRIMO VERTICE DELLA CIRCONFERENZA.
        this.indices.push(0, i, 2)
      }
    }
  }
}

class Cube extends Shape {
  constructor() {
    super()
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
    this.vertices = [
      1.0, 1.0, 1.0,   -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,  1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
      1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
      1.0, 1.0, 1.0,   1.0, 1.0,-1.0,   -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
      -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
      -1.0,-1.0,-1.0,  1.0,-1.0,-1.0,   1.0,-1.0, 1.0,   -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
      1.0,-1.0,-1.0,   -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,  1.0, 1.0,-1.0   // v4-v7-v6-v5 back
    ]

    // Colors
    // prettier-ignore
    this.colors = [
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0      // v4-v7-v6-v5 back
    ]

    // Indices of the vertices
    // prettier-ignore
    this.indices = [
      0,  1,  2,   0, 2,  3,     // front
      4,  5,  6,   4, 6,  7,     // right
      8,  9,  10,  8, 10, 11,    // up
      12, 13, 14, 12, 14, 15,    // left
      16, 17, 18, 16, 18, 19,    // down
      20, 21, 22, 20, 22, 23     // back
    ]
  }
}

class Cylinder extends Shape {
  constructor(nDiv, radius, height, color) {
    super()

    const numberVertices = 2 * nDiv + 2
    const angleStep = 2 * Math.PI / nDiv
    const centreBottom = [0.0, 0.0, 0.0] // Due centri, uno in basso ed uno in alto.
    const centreTop = [0.0, height, 0.0]

    this.vertices.push(...centreBottom) // Indice 0
    this.colors.push(...color)

    this.vertices.push(...centreTop) // Indice 1
    this.colors.push(...color)

    // Carico dalla posizione 2 ad nDiv + 1 i vertici della circonferenza inferiore.
    for (let i = 0, angle = 0; i < nDiv; i++, angle += angleStep) {
      let x = Math.cos(angle) * radius
      let z = Math.sin(angle) * radius

      this.vertices.push(x, centreBottom[1], z) // i ed è il vertice in basso
      this.colors.push(...color)
    }

    // Carico dalla posizione nDiv + 2 ad 2*nDiv + 1 i vertici della circonferenza superiore
    for (let j = 0, angle = 0; j < nDiv; j++, angle += angleStep) {
      let x = Math.cos(angle) * radius
      let z = Math.sin(angle) * radius

      this.vertices.push(x, centreTop[1], z) // i ed è il vertice in basso
      this.colors.push(...color)
    }

    // Itero da 0 a nDiv - 1 per inserire gli indici nel buffer.
    for (let k = 0; k < nDiv; k++) {
      let i = k + 2 // Indice che scorre i vertici della circonferenza inferiore.
      let j = i + nDiv // Indice che scorre i vertici della circonferenza superiore.

      // Se non stiamo considerando gli ultimi vertici sulle circonferenze.
      if (k < nDiv - 1) {
        // Disegnamo le due circonferenze come al solito.
        this.indices.push(i, i + 1, 0)
        this.indices.push(j, j + 1, 1)

        // Disegniamo la maglia costruendo quadrati formati da due triangoli.
        /*
         j      j+1
          + - - +
          |     |
          |     |
          + - - +
         i       i+1
        */

        this.indices.push(i, i + 1, j)
        this.indices.push(j, j + 1, i + 1)
      } else {
        // Come al solito gli ultimi vertici sulle circonferenze vanno uniti coi primi.
        // Il primo vertice della circonferenza inferiore è 2.
        // Il primo vertice della circonferenza superiore è nDiv + 2.
        this.indices.push(i, 2, 0)
        this.indices.push(j, nDiv + 2, 1)

        this.indices.push(i, 2, j)
        this.indices.push(j, nDiv + 2, 2)
      }
    }
  }
}

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
  const camPos = new Vector3([0.0, -2.0, 7.0])

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
      if (geom === true) {
        console.log(geom)
      }
    }

    currentAngle = animate(currentAngle) // Update the rotation angle
    // Calculate the model matrix
    modelMatrix.setRotate(currentAngle, 1, 0, 0) // Rotate around the y-axis

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
  //const shape = new Cone(200, 1, 2, [0.0, 1.0, 0.0])
  //const shape = new Cube()

  //nDiv, radius, height, color
  const shape = new Cylinder(50, 1, 2, [1.0, 1.0, 0.0])
  const vertices = new Float32Array(shape.vertices)
  const indices = new Uint8Array(shape.indices)
  const colors = new Float32Array(shape.colors)

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

  // Write data into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  // verticesColor
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
