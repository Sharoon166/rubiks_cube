import "./style.css"
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerHeight / window.innerWidth, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 10;
renderer.render(scene, camera);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.01


const geo = new THREE.IcosahedronGeometry(2, 2)
const mat = new THREE.MeshStandardMaterial({
    color: 0xffffffff,
    flatShading: true
 });
const decahedron = new THREE.Mesh(geo, mat);
scene.add(decahedron);


const decaWire = new THREE.Mesh(
  geo,
  new THREE.MeshBasicMaterial({
    color: 0x00f2ff,
    wireframe: true,
  })
); 
decahedron.add(decaWire)

const hemiLight = new THREE.HemisphereLight(0xfffaff, 0x222222, 0.8);
scene.add(hemiLight)



window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

function animate() {

    controls.update()
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);