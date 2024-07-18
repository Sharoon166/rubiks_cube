import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
);
dracoLoader.preload();

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setY(-10);
renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.01;
controls.enableZoom = false;
controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2
controls.minPolarAngle = Math.PI / 2


const ambient = new THREE.AmbientLight(0xffffff, 0.05)
scene.add(ambient)

const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(5, 15, 5);
scene.add(directionalLight);

const directionHelper = new THREE.DirectionalLightHelper(directionalLight)
// scene.add(directionHelper)

const spotlight = new THREE.SpotLight(0xffffff, 1000, 30)
spotlight.position.set(20,10,10)
scene.add(spotlight)

const spotHelper = new THREE.SpotLightHelper(spotlight)
// scene.add(spotHelper)

const clock = new THREE.Clock();
let mixer = null;
gltfLoader.load(
  "./scene.gltf",
  (gltf) => {
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    model.name = "Cube";
        model.traverse((child) => {
          if (child.isMesh) {
            child.material.metalness = 0.9; // Increase this value (0-1)
            child.material.roughness = 0.01
            child.material.needsUpdate = true;
          }
        });

    const animations = gltf.animations;
    mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(animations[0]);
    action.play();
    action.setEffectiveTimeScale(0.75);
    

    scene.add(model);
  },
  undefined,
  (error) => {
    console.log(error);
  }
);

function animate() {
  const delta = clock.getDelta();
  mixer?.update(delta);

  if (scene.getObjectByName("Cube")) {
    scene.getObjectByName("Cube").rotation.z += 0.01;
    scene.getObjectByName("Cube").rotation.y += 0.01;
  }

  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
