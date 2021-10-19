import './style.css'
import { OrbitControls  } from 'three/examples/jsm/controls/OrbitControls.js'


console.log('called');

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const geometry = new THREE.PlaneBufferGeometry(1,1)

const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

console.log('threex: ', THREEx);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)


const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const clock = new THREE.Clock()

const animate = () =>
{
    const elapsedTime = clock.getElapsedTime()
    mesh.rotation.y += elapsedTime;

    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(animate)
}

animate()


