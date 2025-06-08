import * as THREE from "three";

// Function to animate the camera for nest auto-rotation
export function animateCamera(camera, controls, nestGroup, isNestActive) {
  let angle = 0;
  let isUserInteracting = false;
  const radius = 5; // Distance from the origin
  const speed = 0.005; // Rotation speed

  // Detect user interaction to pause auto-rotation
  controls.addEventListener("start", () => {
    isUserInteracting = true;
  });
  controls.addEventListener("end", () => {
    isUserInteracting = false;
  });

  function animate() {
    if (isNestActive && !isUserInteracting) {
      angle += speed;
      camera.position.x = radius * Math.cos(angle);
      camera.position.z = radius * Math.sin(angle);
      camera.position.y = 2; // Keep height constant
      camera.lookAt(nestGroup.position); // Always look at the nest
    }
  }

  return animate;
}
