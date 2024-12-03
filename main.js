import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PLYLoader } from "three/examples/jsm/Addons.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const scene = new THREE.Scene();
const gui = new GUI();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const data = {
  lightColor: 0xffffff,
  color: 0x00ff00,
};

camera.position.z = 300;

// const axesHelper = new THREE.AxesHelper(150);
// scene.add(axesHelper);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 设置光源
const pointLight1 = new THREE.PointLight(data.lightColor, 20);
pointLight1.position.set(100, 0, 100);
pointLight1.decay = 0.0;
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(data.lightColor, 20);
pointLight2.position.set(-100, 0, -100);
pointLight2.decay = 0.0;
scene.add(pointLight2);

// 光源相关控制器
// const pointLightFolder = gui.addFolder("Pointlight");
// pointLightFolder.add(pointLight, "visible");
// pointLightFolder.addColor(data, "lightColor").onChange(function () {
//   directionalLight.color.set(data.lightColor);
// });
// pointLightFolder.add(pointLight, "intensity", 0, Math.PI * 10);

// const pointLightHelper = new THREE.PointLightHelper(pointLight1);
// pointLightHelper.visible = true;
// scene.add(pointLightHelper);

// 当窗口大小变化时, 重绘窗口
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

new OrbitControls(camera, renderer.domElement);

let segResultModel;
let segResultMaterial;

// 通过 PLY 加载器加载模型
const loader = new PLYLoader();
loader.load(
  "/model/test.ply",
  function (geometry) {
    console.log(geometry);
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.center();

    segResultMaterial = new THREE.MeshPhongMaterial({
      color: data.color,
      flatShading: true,
    });

    segResultMaterial.color.set(0x297a29);

    segResultModel = new THREE.Mesh(geometry, segResultMaterial);

    renderer.render(scene, camera);
    scene.add(segResultModel);
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

const modelFolder = gui.addFolder("模型");
modelFolder.addColor(data, "color").onChange(function () {
  segResultMaterial.color.set(data.color);
});
modelFolder.open();

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);

  stats.update();
}

animate();
