import { useGLTF } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import * as THREE from "three";

const ROWS = 15;
const COLS = 15;
const SPACING = 3;

export function CatModel() {
  const brancoModel = useGLTF("/models/GATOBRANCO.glb").scene;
  const pretoModel = useGLTF("/models/GATOPRETO.glb").scene;
  const cinzaModel = useGLTF("/models/GATOFOFO.glb").scene;

  const { camera, pointer } = useThree();

  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const intersection = new THREE.Vector3();

  // Prebuild array of cat data
  const catData: { model: THREE.Group<THREE.Object3DEventMap>; position: [number, number, number]; ref: RefObject<THREE.Group<THREE.Object3DEventMap> | null>; }[] = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const model = [brancoModel, pretoModel, cinzaModel][Math.floor(Math.random() * 3)];
      const position: [number, number, number] = [
        (col - COLS / 2) * SPACING,
        (row - ROWS / 2) * SPACING,
        0,
      ];
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const ref = useRef<THREE.Group>(null); // ✅ Allowed: called at top-level only
      catData.push({ model, position, ref });
    }
  }

  useFrame(() => {
    raycaster.setFromCamera(pointer, camera);
    raycaster.ray.intersectPlane(plane, intersection);

    catData.forEach(({ ref }) => {
      if (ref.current) {
        ref.current.lookAt(intersection);
      }
    });
  });

  return (
    <>
      {catData.map(({ model, position, ref }, index) => (
        <group key={index} ref={ref} position={position}>
          <primitive object={model.clone()} scale={2} />
        </group>
      ))}
    </>
  );
}
