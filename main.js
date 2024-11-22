import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PLYLoader } from "three/examples/jsm/Addons.js";
import Stats from "three/addons/libs/stats.module.js";

const width = window.innerWidth,
  height = window.innerHeight;

// init
const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 1000);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight("#606008", 1);
scene.add(ambientLight);

controls.enableDamping = true;

let mesh;

const loader = new PLYLoader();
loader.load(
  "/model/test.ply",
  function (geometry) {
    console.log(geometry);
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();

    // 计算 AABB box 的中心
    const { max, min } = geometry.boundingBox;
    const modelCenter = [
      (max.x + min.x) / 2,
      (max.y + min.y) / 2,
      (max.z + min.z) / 2,
    ];

    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const test = new THREE.BoxGeometry(20, 20, 20);
    mesh = new THREE.Mesh(geometry, material);

    camera.lookAt(modelCenter);
    camera.position.set(modelCenter[0], modelCenter[1] + 100, modelCenter[2]);
    renderer.render(scene, camera);

    scene.add(mesh);
  },
  (xhr) => {
    // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
);

const stats = new Stats();
document.body.appendChild(stats.dom);

renderer.setSize(width, height);
renderer.setAnimationLoop(animate);

document.body.appendChild(renderer.domElement);

// animation

function animate(time) {
  // if (mesh) {
  //   mesh.rotation.x = time / 2000;
  //   mesh.rotation.y = time / 1000;
  // }

  // console.log("代码执行");

  renderer.render(scene, camera);
}
