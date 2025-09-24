//author: @iMosher (TetonTopo)
//description: globe model with wireframe
import * as THREE from "three";
import getStarfield from "../../utils/getStarfield.js";
import { drawThreeGeo } from "../../utils/threeGeoJSON.js";

//scene setup
const w = window.innerWidth;
const h = window.innerHeight;
const canvas = document.getElementById("three-canvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(w, h);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 100);
camera.position.z = 5;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.15);

let scrollPosY = 0;

//line mesh creation for globe
const geometry = new THREE.SphereGeometry(2);
const lineMat = new THREE.LineBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.4,
});
const edges = new THREE.EdgesGeometry(geometry, 1);
const line = new THREE.LineSegments(edges, lineMat);
scene.add(line);

//add starfield
const starfield = getStarfield({ numStars: 1000 });
scene.add(starfield);

//add countries
fetch("../../public/assets/geojson/countries_states.geojson")
  .then((response) => response.text())
  .then((text) => {
    const data = JSON.parse(text);
    const countries = drawThreeGeo({
      json: data,
      radius: 2,
      materialOptions: {
        color: 0x80ff80,
      },
    });
    line.add(countries);
  });

//render loop
function animate() {
  requestAnimationFrame(animate);
  line.rotation.y = 2 * Math.PI * scrollPosY;
  renderer.render(scene, camera);
}
animate();

//scroll event listener
window.addEventListener("scroll", () => {
  scrollPosY = window.scrollY / document.body.clientHeight;
});
//window resize handler
function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", handleWindowResize);
