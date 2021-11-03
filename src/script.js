import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import vertexShader from './shader/vertexPoint.glsl'
import fragmentShader from './shader/fragment.glsl'
import gsap from 'gsap'
// import video from '../static/homeVideoSampleShorter.mp4'

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const canvas = document.querySelector('.webgl')

const scene = new THREE.Scene();

const video = document.querySelector('.video')
const videoTexture = new THREE.VideoTexture(video)

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 5
scene.add(camera);


const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
});

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


//AR.JS
// setup arToolkitSource
const arToolkitSource = new THREEx.ArToolkitSource({
  sourceType: 'webcam',
  // sourceWidth: 660,
  // sourceHeight: 360,
  displayWidth: window.innerWidth,
  displayHeight: window.innerHeight,
});

const onResize = () => {
  arToolkitSource.onResize()
  arToolkitSource.copySizeTo(canvas)
  if (arToolkitContext.arController !== null) {
    arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
  }
}

arToolkitSource.init(function onReady() {
  onResize()
});

// handle resize event
window.addEventListener('resize', function () {
  onResize()

  //desktop resize
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});


// setup arToolkitContext
// create atToolkitContext
const arToolkitContext = new THREEx.ArToolkitContext({
  cameraParametersUrl: 'camera_para.dat', //from https://github.com/jeromeetienne/AR.js/blob/master/data/data/camera_para.dat
  detectionMode: 'color_and_matrix',
});

// copy projection matrix to camera when initialization complete
arToolkitContext.init(function onCompleted() {
  camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});


// setup markerRoots
// build markerControls
const markerRoot = new THREE.Group();
scene.add(markerRoot);

let markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
  type: 'pattern',
  patternUrl: "pattern-marker.patt",
})

//scene content
const geometry = new THREE.BoxGeometry(1.1 *3, 1 *3, 1, 480/2, 360/2, 480/2);

const videoMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uRange: { value: 0 },
    uTexture: { value: videoTexture },
    uResolution: { value: new THREE.Vector4() }
  }
})

const mesh = new THREE.Points(geometry, videoMaterial);
console.log(mesh);
mesh.position.y = 0.5;
mesh.rotation.x = -90;

markerRoot.add(mesh);

//video animation
video.addEventListener('ended', () => {
  gsap.to(videoMaterial.uniforms.uRange, {
    delay: 0.2,
    duration: 30,
    value: 4
  })
})

const update = () => {
  // update artoolkit on every frame
  if (arToolkitSource.ready !== false) {
    arToolkitContext.update(arToolkitSource.domElement)
  }
}

const render = () => {
  renderer.render(scene, camera);
}

const clock = new THREE.Clock()

const animate = () => {
  const elapsedTime = clock.getElapsedTime()
  videoMaterial.uniforms.uTime.value = elapsedTime
  requestAnimationFrame(animate);
  update();
  render();
}

animate()