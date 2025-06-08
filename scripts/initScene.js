import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createProduct } from "./createProduct.js";
import { addLighting } from "./addLighting.js";
import { animateCamera } from "./cameraAnimation.js";
import { setupInteraction } from "./interaction.js";

export function initScene() {
  const scene = new THREE.Scene();

  // Create background
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#000004");
  gradient.addColorStop(0.5, "#020007");
  gradient.addColorStop(1, "#030008");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Add stars
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 1.2;
    const alpha = Math.random() * 0.8 + 0.2;
    const hue = Math.random() * 20 + 240;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = `hsla(${hue}, 70%, 85%, ${alpha})`;
    context.fill();
  }

  const backgroundTexture = new THREE.CanvasTexture(canvas);
  scene.background = backgroundTexture;

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  // Enable shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById("canvas-container").appendChild(renderer.domElement);

  // Add products - now using nestGroup instead of nestGroup
  const { nestGroup, owlGroup } = createProduct();
  scene.add(nestGroup);
  scene.add(owlGroup);

  // Add lighting
  addLighting(scene);

  // Set initial camera position
  camera.position.set(0, 2, 5);
  camera.lookAt(nestGroup.position);

  // Add OrbitControls
  const nestControls = new OrbitControls(camera, renderer.domElement);
  nestControls.enableRotate = false;
  nestControls.enableZoom = true;
  nestControls.enablePan = true;
  nestControls.target.set(0, 0, 0);

  const owlControls = { enabled: false };

  // Set up camera animation
  const animateCam = animateCamera(camera, nestControls, nestGroup, true);

  // Set up interaction
  const isOwlActive = setupInteraction(
    camera,
    scene,
    nestGroup,
    owlGroup,
    nestControls,
    owlControls,
    camera
  );

  function handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", handleResize);
  handleResize();

  function animate() {
    requestAnimationFrame(animate);
    nestControls.update();
    animateCam(camera, nestControls, nestGroup, !isOwlActive());
    renderer.render(scene, camera);
  }
  animate();

  function cleanup() {
    window.removeEventListener("resize", handleResize);
    renderer.dispose();
  }

  return {
    scene,
    camera,
    renderer,
    nestControls,
    owlControls,
    nestGroup,
    owlGroup,
    cleanup,
  };
}
