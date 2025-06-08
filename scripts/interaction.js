import * as THREE from "three";

// Function to set up mouse interaction with raycasting
export function setupInteraction(
  camera,
  scene,
  nestGroup,
  owlGroup,
  nestControls,
  owlControls,
  cameraForReset
) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let currentObject = null;
  let currentTimeout = null;
  let originalScale = null;

  // Panel for part name display
  const infoPanel = document.createElement("div");
  infoPanel.style.position = "absolute";
  infoPanel.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  infoPanel.style.color = "white";
  infoPanel.style.padding = "5px 10px";
  infoPanel.style.borderRadius = "5px";
  infoPanel.style.display = "none";
  document.body.appendChild(infoPanel);

  // Variables for custom owl interaction
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  const rotationSpeed = 0.005;
  const zoomSpeed = 0.1;

  // Custom mouse events for owl rotation and zooming
  window.addEventListener("mousedown", (event) => {
    if (owlControls.enabled) {
      isDragging = true;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  });

  window.addEventListener("mousemove", (event) => {
    if (isDragging && owlControls.enabled) {
      const deltaX = event.clientX - previousMousePosition.x;
      const deltaY = event.clientY - previousMousePosition.y;

      // Rotate owlGroup
      owlGroup.rotation.y += deltaX * rotationSpeed;
      owlGroup.rotation.x += deltaY * rotationSpeed;

      // Clamp vertical rotation to prevent flipping
      owlGroup.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, owlGroup.rotation.x)
      );

      previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("wheel", (event) => {
    if (owlControls.enabled) {
      // Zoom by scaling owlGroup
      const scaleFactor = event.deltaY > 0 ? 1 - zoomSpeed : 1 + zoomSpeed;
      const newScale = owlGroup.scale.x * scaleFactor;
      // Clamp scale to prevent extreme zooming
      if (newScale > 0.5 && newScale < 2) {
        owlGroup.scale.set(newScale, newScale, newScale);
      }
    }
  });

  window.addEventListener("click", (event) => {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the mouse position
    raycaster.setFromCamera(mouse, camera);

    // Find intersected objects
    const nestIntersects = raycaster.intersectObjects(nestGroup.children, true);
    const owlIntersects = raycaster.intersectObjects(owlGroup.children, true);

    console.log(
      "nest intersects:",
      nestIntersects.length,
      nestIntersects.map((i) => i.object.name)
    );
    console.log(
      "Owl intersects:",
      owlIntersects.length,
      owlIntersects.map((i) => i.object.name)
    );

    let object = null;
    if (owlIntersects.length > 0) {
      // Clicked on owl
      owlControls.enabled = true;
      nestControls.enabled = false;
      cameraForReset.position.set(0, 2, 5); // Reset camera position
      cameraForReset.lookAt(nestGroup.position); // Look at nest
      object = owlIntersects[0].object;
      console.log("Switched to owl controls, enabled:", owlControls.enabled);
    } else if (nestIntersects.length > 0) {
      // Clicked on nest
      nestControls.enabled = true;
      owlControls.enabled = false;
      nestControls.target.set(0, 0, 0); // Focus on nest
      cameraForReset.position.set(0, 2, 5); // Reset camera position
      cameraForReset.lookAt(nestGroup.position); // Look at nest
      object = nestIntersects[0].object;
      console.log("Switched to nest controls, enabled:", nestControls.enabled);
    } else {
      console.log("No intersection detected");
    }

    if (object) {
      // Reset previous object scale if exists
      if (currentObject && originalScale) {
        console.log("Resetting scale for previous object:", currentObject.name);
        currentObject.scale.copy(originalScale);
        if (currentTimeout) {
          clearTimeout(currentTimeout);
        }
      }

      // Store new object and its original scale
      currentObject = object;
      originalScale = object.scale.clone();
      object.scale.set(1.2, 1.2, 1.2);
      console.log("Scaling object:", object.name, "to 1.2x");

      // Show part name in panel
      infoPanel.textContent = object.name || "Unnamed Part";
      infoPanel.style.left = `${event.clientX + 10}px`;
      infoPanel.style.top = `${event.clientY + 10}px`;
      infoPanel.style.display = "block";

      // Reset scale and hide panel after 1 second
      currentTimeout = setTimeout(() => {
        if (currentObject) {
          console.log("Restoring scale for object:", currentObject.name);
          currentObject.scale.copy(originalScale);
          currentObject = null;
          originalScale = null;
          currentTimeout = null;
        }
        infoPanel.style.display = "none";
      }, 1000);
    }
  });

  return () => owlControls.enabled; // Return a function to check if owlControls is active
}
