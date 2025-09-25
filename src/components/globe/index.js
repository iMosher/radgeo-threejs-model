//author: @iMosher (TetonTopo)
//description: globe model with wireframe
import * as THREE from "three";
import getLayer from "../../utils/getLayer.js";
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
geometry.center();
const lineMat = new THREE.LineBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.4,
});
const edges = new THREE.EdgesGeometry(geometry, 1);
const globe = new THREE.LineSegments(edges, lineMat);
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
    globe.add(countries);
  });
globe.position.set(1.2, -1, 0);
scene.add(globe);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(hemiLight);

const gradientBackground = getLayer({
  hasFog: false,
  hue: 0.6,
  numSprites: 8,
  opacity: 0.2,
  radius: 10,
  size: 30,
  z: -10.5,
});
scene.add(gradientBackground);

//add starfield
const starfield = getStarfield({ numStars: 4500 });
scene.add(starfield);

//render loop
function animate() {
  requestAnimationFrame(animate);
  const goalPos = Math.PI * scrollPosY;
  globe.rotation.y -= (globe.rotation.y - goalPos * 1.0) * 0.1;
  starfield.position.z = -20 * scrollPosY;
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
