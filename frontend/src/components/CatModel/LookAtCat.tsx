import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface LookAtCatProps {
  model: THREE.Object3D;
  position: [number, number, number];
  scale?: number;
}

export function LookAtCat({ model, position, scale = 3}: LookAtCatProps) {
  const catRef = useRef<THREE.Group>(null!);
  const { camera, pointer } = useThree();
  const pointerPosition = useRef({ x: 0, y: 0 });

  useFrame(() => {
    pointerPosition.current = { x: pointer.x, y: pointer.y };
  });
  const target = new THREE.Vector3();

  useFrame(() => {
    target.set(pointerPosition.current.x, pointerPosition.current.y, 0.5).unproject(camera);
    if (catRef.current) {
      catRef.current.lookAt(target);
    }
  });

  return (
    <group ref={catRef} position={position}>
      <primitive object={model} scale={scale} />
    </group>
  );
}
