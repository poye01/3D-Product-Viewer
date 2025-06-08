import * as THREE from 'three';
export function addLighting(scene) {
  // Ambient light for general illumination
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);
  // Main directional light for shadows
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  directionalLight.position.set(5, 10, 7);
  directionalLight.castShadow = true;
  // Shadow properties
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 25;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  directionalLight.shadow.bias = -0.001;
  scene.add(directionalLight);
  // Fill light to reduce harsh shadows
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
  directionalLight2.position.set(-5, 5, -5);
  scene.add(directionalLight2);
  // Optional: Add a subtle point light near the owl
  const pointLight = new THREE.PointLight(0xfff0e0, 0.5, 5);
  pointLight.position.set(0, 2, 2);
  scene.add(pointLight);
  // Optional: Add shadow camera helper for debugging
  // const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
  // scene.add(shadowHelper);
}