import gsap from 'gsap';
import * as THREE from 'https://cdn.skypack.dev/three';
import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';
import vertexShader from './Shaders/vertex.glsl'
import fragmentShader from './Shaders/fragment.glsl'
import atmosphereVertexShader from './Shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './Shaders/atmosphereFragment.glsl'

const canvasDiv = document.getElementById("canvasDiv");

const scene = new THREE.Scene();
//const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
const camera = new THREE.PerspectiveCamera(75, canvasDiv.offsetWidth / canvasDiv.offsetHeight, 0.01, 1000);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('canvas')
});

renderer.setSize(canvasDiv.offsetWidth, canvasDiv.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);
//document.body.appendChild(renderer.domElement);
window.addEventListener('resize', onWindowResize);

// Create a sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load('./img/globe-satellite.jpg')
      }
    }
  })
);

//scene.add(sphere);

// Create atmosphere
const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
);
atmosphere.scale.set(1.2, 1.2, 1.2);
scene.add(atmosphere);

const group = new THREE.Group();
group.add(sphere);
scene.add(group);

// Ceare Stars
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff
})

const starVertices = [];
for (let index = 0; index < 5000; index++) {
  const x = (Math.random() - 0.5) * 1000;
  const y = (Math.random() - 0.5) * 2000;
  const z = - Math.random() * 200;
  starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

camera.position.z = 10;
const controls = new OrbitControls(camera, renderer.domElement);

const mouse = {
  x: 0,
  y: 0
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  sphere.rotation.y += 0.002;
  gsap.to(group.rotation, {
    x: - mouse.y,
    y: mouse.x,
    duration: 2
  })
}



addEventListener('mousemove', () => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;

  //console.log(mouse);
});

function onWindowResize() {

  camera.aspect = canvasDiv.offsetWidth / canvasDiv.offsetHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(canvasDiv.offsetWidth, canvasDiv.offsetHeight);

}

animate();
