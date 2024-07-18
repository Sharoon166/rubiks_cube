import "./style.css"

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight)

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg")
})

renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 25;
renderer.render(scene, camera);


const textureLoader = new THREE.TextureLoader();

const earthTexture = textureLoader.load("./world5400x2700.jpg");

const moonTexture = textureLoader.load("./moon.jpg");

const gemoetry = new THREE.SphereGeometry(5, 200, 200);
const material = new THREE.MeshStandardMaterial({
    map: earthTexture
})

const earth = new THREE.Mesh(gemoetry, material);
scene.add(earth);

const moon = new THREE.Mesh(new THREE.SphereGeometry(3, 200, 200), new THREE.MeshStandardMaterial({
    map: moonTexture,
}))
moon.position.set(-15, 2, 0);
scene.add(moon)


const pointLight = new THREE.PointLight(0xffffff, 500);
pointLight.position.set(30, 5, 10);
scene.add(pointLight);


const ambientLight = new THREE.AmbientLight(0xffffffff, 0.02)
scene.add(ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.01
controls.enableZoom = false;


function animate() {
    earth.rotation.y += 0.01

    moon.rotation.y += 0.003
    moon.rotation.z += 0.0001

    moon.position.x = Math.sin(moon.rotation.y) * 15
    moon.position.z = Math.cos(moon.rotation.y) * 15

    controls.update();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.onresize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}



