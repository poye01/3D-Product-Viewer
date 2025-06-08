import * as THREE from "three";
import { initScene } from "./initScene.js";
import { addLighting } from "./addLighting.js";
import { setupInteraction } from "./interaction.js";
import { animateCamera } from "./cameraAnimation.js";

// Initialize the scene
const {
  scene,
  camera,
  renderer,
  nestControls,
  owlControls,
  nestGroup,
  owlGroup,
} = initScene();

// Add lighting
addLighting(scene);

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

// Set up camera animation for nest
const animateCam = animateCamera(camera, nestControls, nestGroup, true);

// Animation loop
function animateLoop() {
  requestAnimationFrame(animateLoop);

  // Update camera auto-rotation for nest
  animateCam(camera, nestControls, nestGroup, !isOwlActive());

  // Update nest controls
  nestControls.update();

  renderer.render(scene, camera);
}
animateLoop();
