import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
);
dracoLoader.preload();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

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

const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(0, 50, 5);
scene.add(directionalLight);

const spotlight = new THREE.SpotLight(0xffffff, 10000, 50);
spotlight.position.set(20, 10, 10);
scene.add(spotlight);

const pointLight = new THREE.PointLight(0xffffff, 10000);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xfff555, 10);
pointLight2.position.set(0, 0, 8);
scene.add(pointLight2);

const clock = new THREE.Clock();
let mixer = null;
gltfLoader.load(
  "/scene.gltf",
  (gltf) => {
    const model = gltf.scene;
    model.name = "Cube";
    model.traverse((child) => {
      if (child.isMesh) {
        child.material.metalness = 0.9;
        child.material.roughness = 0.01;
        child.material.reflectivity = 0.9;
      }
    });

    const animations = gltf.animations;
    mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(animations[0]);
    action.play();
    action.setEffectiveTimeScale(0.7);

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
    const cube = scene.getObjectByName("Cube");

    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;
    cube.rotation.z += 0.002;
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
