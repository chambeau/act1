import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import * as dat from "lil-gui";

// GUI
const gui = new dat.GUI();

// SCENE
const scene = new THREE.Scene();

// SIZES
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

// CAMERA
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
);
camera.position.z = 5;

// RENDERER
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// LIGHT
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-100, 10, 50);
scene.add(light);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.05);
scene.add(hemiLight);

// TEXTURE
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/textures/moon.jpg");
texture.encoding = THREE.sRGBEncoding;

const displacementMap = textureLoader.load("/textures/displacement.jpg");

const memeTexture = textureLoader.load("/textures/meme.png");
memeTexture.encoding = THREE.sRGBEncoding;

// FONT
const fontLoader = new FontLoader();

fontLoader.load("fonts/helvetiker_regular.typeface.json", (font) => {
    const material = new THREE.MeshBasicMaterial({
        color: 0xa6a6a6,
    });

    //text
    const textGeometry = new TextGeometry("Moon", {
        font: font,
        size: 0.5,
        depth: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
    });
    textGeometry.center();
    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);
    text.scale.z = 0.5;

    text.position.y = 2.75;
});

//MEME
const memeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const memeMaterial = new THREE.MeshStandardMaterial({ map: memeTexture });
const meme = new THREE.Mesh(memeGeometry, memeMaterial);
scene.add(meme);

// MOON
const moonGeometry = new THREE.SphereGeometry(2, 60, 60);
const moonMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: texture,
    displacementMap: displacementMap,
    displacementScale: 0.08,
    bumpMap: displacementMap,
    bumpScale: 0.03,
    shininess: 0,
});

const params = {
    wireframe: moonMaterial.wireframe,
};

gui.add(params, "wireframe")
    .name("Wireframe")
    .onChange((value) => {
        moonMaterial.wireframe = value;
    });

const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

// RESIZE
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onResize, false);

// STARS
function addStar() {
    const geometry = new THREE.SphereGeometry(0.05, 16, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(300));

    star.position.set(x, y, z);
    scene.add(star);
}

Array(5000).fill().forEach(addStar);

// ANIMATE
function animate() {
    requestAnimationFrame(animate);

    moon.rotation.y += 0.002;
    moon.rotation.x += 0.0001;

    controls.update(); // Smooth controls
    renderer.render(scene, camera);
}
animate();
