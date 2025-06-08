import * as THREE from "three";

// Function to create a simple procedural environment map for reflections
function createEnvironmentMap() {
  const size = 512;
  const data = new Uint8Array(size * size * 3);
  for (let i = 0; i < size * size * 3; i += 3) {
    // Soft white-blue gradient for subtle reflections
    data[i] = 200; // R
    data[i + 1] = 220; // G
    data[i + 2] = 255; // B
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.needsUpdate = true;

  const cubeTexture = new THREE.CubeTexture([
    texture,
    texture,
    texture,
    texture,
    texture,
    texture,
  ]);
  cubeTexture.needsUpdate = true;
  return cubeTexture;
}

// Function to create the Nest and Owl as separate groups
export function createProduct() {
  const nestGroup = new THREE.Group();
  const owlGroup = new THREE.Group();

  // Environment map for reflections
  const envMap = createEnvironmentMap();

  // 1. Main Nest Structure
  const nestBaseGeometry = new THREE.CylinderGeometry(1.2, 1.5, 0.5, 32);
  const nestMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b5a2b, // Natural brown color
    roughness: 0.9, // Rough texture
    metalness: 0.0,
    envMap: envMap,
    envMapIntensity: 0.3,
  });
  const nestBase = new THREE.Mesh(nestBaseGeometry, nestMaterial);
  nestBase.position.set(0, 0, 0);
  nestBase.castShadow = true;
  nestBase.receiveShadow = true;
  nestBase.name = "Nest Base";
  nestGroup.add(nestBase);

  // 2. Nest Interior (softer material)
  const nestInteriorGeometry = new THREE.SphereGeometry(
    1.0,
    32,
    32,
    0,
    Math.PI * 2,
    0,
    Math.PI / 2
  );
  nestInteriorGeometry.scale(1, 0.3, 1);
  const interiorMaterial = new THREE.MeshStandardMaterial({
    color: 0xa67c52, // Lighter brown
    roughness: 0.95,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });
  const nestInterior = new THREE.Mesh(nestInteriorGeometry, interiorMaterial);
  nestInterior.position.set(0, 0.25, 0);
  nestInterior.rotation.x = Math.PI;
  nestInterior.castShadow = true;
  nestInterior.receiveShadow = true;
  nestInterior.name = "Nest Interior";
  nestGroup.add(nestInterior);

  // 3. Twigs and Branches
  const twigMaterial = new THREE.MeshStandardMaterial({
    color: 0x6b4f32, // Darker brown for twigs
    roughness: 0.95,
    metalness: 0.0,
  });

  // Create multiple twigs around the nest
  for (let i = 0; i < 30; i++) {
    const angle = (i / 30) * Math.PI * 2;
    const radius = 1.3 + Math.random() * 0.3;
    const height = 0.1 + Math.random() * 0.3;

    const twigGeometry = new THREE.CylinderGeometry(
      0.02 + Math.random() * 0.03,
      0.02 + Math.random() * 0.03,
      0.5 + Math.random() * 0.5,
      6
    );

    const twig = new THREE.Mesh(twigGeometry, twigMaterial);
    twig.position.set(
      radius * Math.cos(angle),
      height,
      radius * Math.sin(angle)
    );

    // Random rotations for natural look
    twig.rotation.x = Math.random() * Math.PI;
    twig.rotation.y = Math.random() * Math.PI;
    twig.rotation.z = Math.random() * Math.PI;

    twig.castShadow = true;
    twig.receiveShadow = true;
    twig.name = `Twig ${i + 1}`;
    nestGroup.add(twig);
  }

  // 4. Leaves and foliage
  const leafMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a7023, // Green color for leaves
    roughness: 0.9,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });

  // Create leaf geometry (simple triangle)
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.lineTo(0.2, 0.1);
  leafShape.lineTo(0, 0.3);
  leafShape.lineTo(-0.2, 0.1);
  const leafGeometry = new THREE.ShapeGeometry(leafShape);

  // Add leaves around the nest
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.4 + Math.random() * 0.4;
    const height = 0.2 + Math.random() * 0.4;

    const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf.position.set(
      radius * Math.cos(angle),
      height,
      radius * Math.sin(angle)
    );

    // Scale and rotate randomly
    leaf.scale.set(0.5 + Math.random(), 0.5 + Math.random(), 1);
    leaf.rotation.x = Math.random() * Math.PI;
    leaf.rotation.y = Math.random() * Math.PI;
    leaf.rotation.z = Math.random() * Math.PI;

    leaf.castShadow = true;
    leaf.receiveShadow = true;
    leaf.name = `Leaf ${i + 1}`;
    nestGroup.add(leaf);
  }

  // 5. Nest lining (softer materials like feathers or moss)
  const liningGeometry = new THREE.SphereGeometry(
    0.9,
    32,
    32,
    0,
    Math.PI * 2,
    0,
    Math.PI / 2
  );
  liningGeometry.scale(1, 0.2, 1);
  const liningMaterial = new THREE.MeshStandardMaterial({
    color: 0xc9b29b, // Soft feather-like color
    roughness: 0.95,
    metalness: 0.0,
  });
  const lining = new THREE.Mesh(liningGeometry, liningMaterial);
  lining.position.set(0, 0.1, 0);
  lining.rotation.x = Math.PI;
  lining.castShadow = true;
  lining.receiveShadow = true;
  lining.name = "Nest Lining";
  nestGroup.add(lining);

  // Owl Creation with more realistic features
  const owlBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x6d5c54,
    roughness: 0.8,
    metalness: 0.0,
    envMap: envMap,
    envMapIntensity: 0.3,
  });

  const owlFeatherMaterial = new THREE.MeshStandardMaterial({
    color: 0x5a4a42,
    roughness: 0.9,
    metalness: 0.0,
    envMap: envMap,
    envMapIntensity: 0.2,
  });

  // Owl Body - More oval shape
  const bodyGeometry = new THREE.SphereGeometry(0.4, 32, 32);
  bodyGeometry.scale(1.2, 1.5, 1);
  const body = new THREE.Mesh(bodyGeometry, owlBodyMaterial);
  body.position.set(0, 0.8, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  body.name = "Owl Body";
  owlGroup.add(body);

  // Owl Head - More detailed shape
  const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
  headGeometry.scale(1.1, 1.1, 1);
  const head = new THREE.Mesh(headGeometry, owlBodyMaterial);
  head.position.set(0, 1.3, 0);
  head.castShadow = true;
  head.receiveShadow = true;
  head.name = "Owl Head";
  owlGroup.add(head);

  // Owl Eyes - More detailed with eyelids
  const eyeGeometry = new THREE.SphereGeometry(0.08, 32, 32);
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700, // Golden yellow for more realistic owl eyes
    roughness: 0.2,
    metalness: 0.3,
    envMap: envMap,
    envMapIntensity: 0.7,
  });

  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-0.1, 1.32, 0.25);
  leftEye.name = "Owl Left Eye";
  owlGroup.add(leftEye);

  const rightEye = leftEye.clone();
  rightEye.position.set(0.1, 1.32, 0.25);
  rightEye.name = "Owl Right Eye";
  owlGroup.add(rightEye);

  // Eye pupils - Larger for better visibility
  const pupilGeometry = new THREE.SphereGeometry(0.05, 32, 32);
  const pupilMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.1,
    metalness: 0.0,
  });

  const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
  leftPupil.position.set(-0.1, 1.32, 0.31);
  leftPupil.name = "Owl Left Pupil";
  owlGroup.add(leftPupil);

  const rightPupil = leftPupil.clone();
  rightPupil.position.set(0.1, 1.32, 0.31);
  rightPupil.name = "Owl Right Pupil";
  owlGroup.add(rightPupil);

  // Eye highlights - More pronounced
  const highlightGeometry = new THREE.SphereGeometry(0.015, 16, 16);
  const highlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.8,
  });

  const leftHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
  leftHighlight.position.set(-0.12, 1.34, 0.32);
  leftHighlight.name = "Owl Left Eye Highlight";
  owlGroup.add(leftHighlight);

  const rightHighlight = leftHighlight.clone();
  rightHighlight.position.set(0.08, 1.34, 0.32);
  rightHighlight.name = "Owl Right Eye Highlight";
  owlGroup.add(rightHighlight);

  // Eyelids - Added for realism
  const eyelidGeometry = new THREE.TorusGeometry(0.09, 0.02, 16, 32, Math.PI);
  const eyelidMaterial = new THREE.MeshStandardMaterial({
    color: 0x5a4a42,
    roughness: 0.9,
    metalness: 0.0,
  });

  const leftEyelid = new THREE.Mesh(eyelidGeometry, eyelidMaterial);
  leftEyelid.position.set(-0.1, 1.32, 0.25);
  leftEyelid.rotation.z = Math.PI / 2;
  leftEyelid.name = "Owl Left Eyelid";
  owlGroup.add(leftEyelid);

  const rightEyelid = leftEyelid.clone();
  rightEyelid.position.set(0.1, 1.32, 0.25);
  rightEyelid.name = "Owl Right Eyelid";
  owlGroup.add(rightEyelid);

  // Owl Beak - More detailed shape
  const beakGeometry = new THREE.ConeGeometry(0.05, 0.2, 32);
  beakGeometry.scale(0.8, 1.2, 0.8);
  const beakMaterial = new THREE.MeshStandardMaterial({
    color: 0xe6c229, // More yellow for realism
    roughness: 0.6,
    metalness: 0.2,
    envMap: envMap,
    envMapIntensity: 0.5,
  });
  const beak = new THREE.Mesh(beakGeometry, beakMaterial);
  beak.position.set(0, 1.25, 0.38);
  beak.rotation.x = Math.PI / 2;
  beak.castShadow = true;
  beak.receiveShadow = true;
  beak.name = "Owl Beak";
  owlGroup.add(beak);

  // Owl Ears - Larger and more prominent ear tufts
  const earGeometry = new THREE.ConeGeometry(0.07, 0.25, 32);
  const earMaterial = new THREE.MeshStandardMaterial({
    color: 0x5a4a42,
    roughness: 0.9,
    metalness: 0.0,
  });

  // Left ear tufts
  const leftEar1 = new THREE.Mesh(earGeometry, earMaterial);
  leftEar1.position.set(-0.18, 1.5, 0.1);
  leftEar1.rotation.set(-0.6, 0, -0.4);
  leftEar1.name = "Owl Left Ear 1";
  owlGroup.add(leftEar1);

  const leftEar2 = new THREE.Mesh(earGeometry, earMaterial);
  leftEar2.position.set(-0.22, 1.55, 0.05);
  leftEar2.rotation.set(-0.8, 0, -0.3);
  leftEar2.name = "Owl Left Ear 2";
  owlGroup.add(leftEar2);

  // Right ear tufts
  const rightEar1 = new THREE.Mesh(earGeometry, earMaterial);
  rightEar1.position.set(0.18, 1.5, 0.1);
  rightEar1.rotation.set(-0.6, 0, 0.4);
  rightEar1.name = "Owl Right Ear 1";
  owlGroup.add(rightEar1);

  const rightEar2 = new THREE.Mesh(earGeometry, earMaterial);
  rightEar2.position.set(0.22, 1.55, 0.05);
  rightEar2.rotation.set(-0.8, 0, 0.3);
  rightEar2.name = "Owl Right Ear 2";
  owlGroup.add(rightEar2);

  // Owl Wings - Reduced size for better proportions
  const wingGeometry = new THREE.SphereGeometry(
    0.3, // Reduced from 0.35
    32,
    32,
    0,
    Math.PI * 2,
    0,
    Math.PI / 1.5
  );
  wingGeometry.scale(1.5, 0.8, 0.5); // Reduced scale from 1.8
  const leftWing = new THREE.Mesh(wingGeometry, owlFeatherMaterial);
  leftWing.position.set(-0.4, 0.8, 0); // Adjusted position from -0.45
  leftWing.rotation.z = Math.PI / 2;
  leftWing.castShadow = true;
  leftWing.receiveShadow = true;
  leftWing.name = "Owl Left Wing";
  owlGroup.add(leftWing);

  const rightWing = leftWing.clone();
  rightWing.position.set(0.4, 0.8, 0); // Adjusted position from 0.45
  rightWing.rotation.z = -Math.PI / 2;
  rightWing.name = "Owl Right Wing";
  owlGroup.add(rightWing);

  // Feather details on wings - Adjusted for smaller size
  const featherGeometry = new THREE.ConeGeometry(0.04, 0.15, 4); // Reduced size
  featherGeometry.scale(1, 2, 1); // Reduced scale from 2.5
  const featherMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a3a32,
    roughness: 0.9,
    metalness: 0.0,
  });

  // Primary flight feathers - Reduced number and adjusted positions
  for (let i = 0; i < 5; i++) {
    // Reduced from 6
    const leftFeather = new THREE.Mesh(featherGeometry, featherMaterial);
    leftFeather.position.set(-0.35 - i * 0.05, 0.75 + i * 0.04, 0); // Adjusted positions
    leftFeather.rotation.set(Math.PI / 2, 0, Math.PI / 2);
    leftFeather.name = `Owl Left Wing Feather ${i + 1}`;
    owlGroup.add(leftFeather);

    const rightFeather = leftFeather.clone();
    rightFeather.position.set(0.35 + i * 0.05, 0.75 + i * 0.04, 0); // Adjusted positions
    rightFeather.rotation.set(Math.PI / 2, 0, -Math.PI / 2);
    rightFeather.name = `Owl Right Wing Feather ${i + 1}`;
    owlGroup.add(rightFeather);
  }

  // Secondary feathers - Reduced number and adjusted positions
  for (let i = 0; i < 3; i++) {
    // Reduced from 4
    const leftFeather = new THREE.Mesh(featherGeometry, featherMaterial);
    leftFeather.position.set(-0.3 - i * 0.03, 0.82 + i * 0.02, 0.08); // Adjusted positions
    leftFeather.rotation.set(Math.PI / 2, 0.2, Math.PI / 2);
    leftFeather.name = `Owl Left Wing Secondary Feather ${i + 1}`;
    owlGroup.add(leftFeather);

    const rightFeather = leftFeather.clone();
    rightFeather.position.set(0.3 + i * 0.03, 0.82 + i * 0.02, 0.08); // Adjusted positions
    rightFeather.rotation.set(Math.PI / 2, -0.2, -Math.PI / 2);
    rightFeather.name = `Owl Right Wing Secondary Feather ${i + 1}`;
    owlGroup.add(rightFeather);
  }

  // Owl Feet - More detailed with claws
  const footGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.2, 8);
  const footMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b5a2b,
    roughness: 0.8,
    metalness: 0.0,
    envMap: envMap,
    envMapIntensity: 0.3,
  });

  // Claw geometry
  const clawGeometry = new THREE.ConeGeometry(0.01, 0.05, 8);
  const clawMaterial = new THREE.MeshStandardMaterial({
    color: 0x5a4a42,
    roughness: 0.7,
    metalness: 0.1,
  });

  // Left foot
  const leftFoot1 = new THREE.Mesh(footGeometry, footMaterial);
  leftFoot1.position.set(-0.15, 0.55, 0.1);
  leftFoot1.rotation.x = Math.PI / 6;
  leftFoot1.rotation.z = Math.PI / 6;
  leftFoot1.castShadow = true;
  leftFoot1.receiveShadow = true;
  leftFoot1.name = "Owl Left Foot 1";
  owlGroup.add(leftFoot1);

  // Left foot claws
  const leftClaw1 = new THREE.Mesh(clawGeometry, clawMaterial);
  leftClaw1.position.set(-0.15, 0.45, 0.15);
  leftClaw1.rotation.x = -Math.PI / 3;
  owlGroup.add(leftClaw1);

  const leftClaw2 = leftClaw1.clone();
  leftClaw2.position.set(-0.17, 0.45, 0.1);
  leftClaw2.rotation.x = -Math.PI / 6;
  owlGroup.add(leftClaw2);

  const leftClaw3 = leftClaw1.clone();
  leftClaw3.position.set(-0.13, 0.45, 0.1);
  leftClaw3.rotation.x = -Math.PI / 6;
  owlGroup.add(leftClaw3);

  const leftFoot2 = leftFoot1.clone();
  leftFoot2.position.set(-0.2, 0.55, 0);
  leftFoot2.rotation.x = Math.PI / 6;
  leftFoot2.rotation.z = Math.PI / 12;
  leftFoot2.name = "Owl Left Foot 2";
  owlGroup.add(leftFoot2);

  // Left foot 2 claws
  const leftClaw4 = new THREE.Mesh(clawGeometry, clawMaterial);
  leftClaw4.position.set(-0.2, 0.45, 0.05);
  leftClaw4.rotation.x = -Math.PI / 4;
  owlGroup.add(leftClaw4);

  const leftClaw5 = leftClaw4.clone();
  leftClaw5.position.set(-0.22, 0.45, 0);
  owlGroup.add(leftClaw5);

  const leftClaw6 = leftClaw4.clone();
  leftClaw6.position.set(-0.18, 0.45, 0);
  owlGroup.add(leftClaw6);

  const leftFoot3 = leftFoot1.clone();
  leftFoot3.position.set(-0.15, 0.55, -0.1);
  leftFoot3.rotation.x = -Math.PI / 6;
  leftFoot3.rotation.z = Math.PI / 6;
  leftFoot3.name = "Owl Left Foot 3";
  owlGroup.add(leftFoot3);

  // Left foot 3 claws
  const leftClaw7 = new THREE.Mesh(clawGeometry, clawMaterial);
  leftClaw7.position.set(-0.15, 0.45, -0.15);
  leftClaw7.rotation.x = Math.PI / 3;
  owlGroup.add(leftClaw7);

  const leftClaw8 = leftClaw7.clone();
  leftClaw8.position.set(-0.17, 0.45, -0.1);
  leftClaw8.rotation.x = Math.PI / 6;
  owlGroup.add(leftClaw8);

  const leftClaw9 = leftClaw7.clone();
  leftClaw9.position.set(-0.13, 0.45, -0.1);
  leftClaw9.rotation.x = Math.PI / 6;
  owlGroup.add(leftClaw9);

  // Right foot
  const rightFoot1 = leftFoot1.clone();
  rightFoot1.position.set(0.15, 0.55, 0.1);
  rightFoot1.rotation.x = Math.PI / 6;
  rightFoot1.rotation.z = -Math.PI / 6;
  rightFoot1.name = "Owl Right Foot 1";
  owlGroup.add(rightFoot1);

  // Right foot claws
  const rightClaw1 = leftClaw1.clone();
  rightClaw1.position.set(0.15, 0.45, 0.15);
  rightClaw1.rotation.x = -Math.PI / 3;
  owlGroup.add(rightClaw1);

  const rightClaw2 = leftClaw2.clone();
  rightClaw2.position.set(0.17, 0.45, 0.1);
  rightClaw2.rotation.x = -Math.PI / 6;
  owlGroup.add(rightClaw2);

  const rightClaw3 = leftClaw3.clone();
  rightClaw3.position.set(0.13, 0.45, 0.1);
  rightClaw3.rotation.x = -Math.PI / 6;
  owlGroup.add(rightClaw3);

  const rightFoot2 = leftFoot2.clone();
  rightFoot2.position.set(0.2, 0.55, 0);
  rightFoot2.rotation.x = Math.PI / 6;
  rightFoot2.rotation.z = -Math.PI / 12;
  rightFoot2.name = "Owl Right Foot 2";
  owlGroup.add(rightFoot2);

  // Right foot 2 claws
  const rightClaw4 = leftClaw4.clone();
  rightClaw4.position.set(0.2, 0.45, 0.05);
  rightClaw4.rotation.x = -Math.PI / 4;
  owlGroup.add(rightClaw4);

  const rightClaw5 = leftClaw5.clone();
  rightClaw5.position.set(0.22, 0.45, 0);
  owlGroup.add(rightClaw5);

  const rightClaw6 = leftClaw6.clone();
  rightClaw6.position.set(0.18, 0.45, 0);
  owlGroup.add(rightClaw6);

  const rightFoot3 = leftFoot3.clone();
  rightFoot3.position.set(0.15, 0.55, -0.1);
  rightFoot3.rotation.x = -Math.PI / 6;
  rightFoot3.rotation.z = -Math.PI / 6;
  rightFoot3.name = "Owl Right Foot 3";
  owlGroup.add(rightFoot3);

  // Right foot 3 claws
  const rightClaw7 = leftClaw7.clone();
  rightClaw7.position.set(0.15, 0.45, -0.15);
  rightClaw7.rotation.x = Math.PI / 3;
  owlGroup.add(rightClaw7);

  const rightClaw8 = leftClaw8.clone();
  rightClaw8.position.set(0.17, 0.45, -0.1);
  rightClaw8.rotation.x = Math.PI / 6;
  owlGroup.add(rightClaw8);

  const rightClaw9 = leftClaw9.clone();
  rightClaw9.position.set(0.13, 0.45, -0.1);
  rightClaw9.rotation.x = Math.PI / 6;
  owlGroup.add(rightClaw9);

  // Owl Feather Crest - More detailed
  const crestGeometry = new THREE.ConeGeometry(0.05, 0.2, 16);
  const crestMaterial = new THREE.MeshStandardMaterial({
    color: 0x5a4a42,
    roughness: 0.9,
    metalness: 0.0,
  });

  // Center crest
  const crestCenter = new THREE.Mesh(crestGeometry, crestMaterial);
  crestCenter.position.set(0, 1.5, 0.05);
  crestCenter.rotation.x = Math.PI + 0.2;
  crestCenter.castShadow = true;
  crestCenter.receiveShadow = true;
  crestCenter.name = "Owl Crest Center";
  owlGroup.add(crestCenter);

  // Left crest feathers
  const crestLeft1 = crestCenter.clone();
  crestLeft1.position.set(-0.1, 1.48, 0.05);
  crestLeft1.rotation.x = Math.PI + 0.3;
  crestLeft1.rotation.z = -0.3;
  crestLeft1.name = "Owl Crest Left 1";
  owlGroup.add(crestLeft1);

  const crestLeft2 = crestCenter.clone();
  crestLeft2.position.set(-0.18, 1.45, 0.03);
  crestLeft2.rotation.x = Math.PI + 0.5;
  crestLeft2.rotation.z = -0.2;
  crestLeft2.name = "Owl Crest Left 2";
  owlGroup.add(crestLeft2);

  // Right crest feathers
  const crestRight1 = crestLeft1.clone();
  crestRight1.position.set(0.1, 1.48, 0.05);
  crestRight1.rotation.z = 0.3;
  crestRight1.name = "Owl Crest Right 1";
  owlGroup.add(crestRight1);

  const crestRight2 = crestLeft2.clone();
  crestRight2.position.set(0.18, 1.45, 0.03);
  crestRight2.rotation.z = 0.2;
  crestRight2.name = "Owl Crest Right 2";
  owlGroup.add(crestRight2);

  // Facial disc - More detailed with feather texture
  const faceDiscGeometry = new THREE.RingGeometry(0.22, 0.3, 32);
  const faceDiscMaterial = new THREE.MeshStandardMaterial({
    color: 0x7a6a62,
    roughness: 0.9,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });
  const faceDisc = new THREE.Mesh(faceDiscGeometry, faceDiscMaterial);
  faceDisc.position.set(0, 1.3, 0.2);
  faceDisc.rotation.x = Math.PI / 2;
  faceDisc.name = "Owl Facial Disc";
  owlGroup.add(faceDisc);

  // Feather texture on facial disc
  const discFeatherGeometry = new THREE.ConeGeometry(0.02, 0.08, 4);
  const discFeatherMaterial = new THREE.MeshStandardMaterial({
    color: 0x8a7a72,
    roughness: 0.9,
    metalness: 0.0,
  });

  // Add radial feathers to facial disc
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const radius = 0.25;
    const feather = new THREE.Mesh(discFeatherGeometry, discFeatherMaterial);
    feather.position.set(
      radius * Math.cos(angle),
      1.3,
      radius * Math.sin(angle) + 0.2
    );
    feather.rotation.set(
      Math.PI / 2 + Math.sin(angle) * 0.2,
      0,
      angle + Math.PI / 2
    );
    feather.name = `Facial Feather ${i + 1}`;
    owlGroup.add(feather);
  }

  // Position the owl inside the nest
  owlGroup.position.set(0, 0.1, 0);

  // Center the groups at (0, 0, 0)
  nestGroup.position.set(0, 0, 0);
  owlGroup.position.set(0, 0, 0);
  nestGroup.updateMatrixWorld();
  owlGroup.updateMatrixWorld();

  return { nestGroup, owlGroup };
}
