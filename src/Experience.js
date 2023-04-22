import { Suspense } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { useAspect, useVideoTexture, useTexture, OrbitControls} from '@react-three/drei';
import { useState, useMemo } from "react";
import { Vector2 } from 'three';

import * as THREE from 'three';
import cheese from './imagenes/cheese.png';
import bowson from './imagenes/bowson.png';
import ame from './imagenes/ame.png';
import ringo from './imagenes/ringo.jpg';

export default function Experience() {
  
  return (
    <Canvas orthographic>
      <OrbitControls makeDefault position={[0,0,0]} />
      <Scene />
    </Canvas>
  )
}

function Scene() {
  const [videoLoaded, setVideoLoaded] = useState(false)

  const handlePlaneClick = () => {
    setVideoLoaded(true)
  }
 
  const [imagenIndex, setImagenIndex] = useState(0);
  const raycaster = new THREE.Raycaster();
  const mouse = new Vector2();
  const { camera, scene } = useThree();

  const imagenes = [cheese, ame, ringo, bowson];
  const imagenUrl = imagenes[imagenIndex];

  const texture = useMemo(() => useLoader(THREE.TextureLoader, imagenUrl), [imagenUrl]);
  const handleClick = (event) => {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    const intersectedObject = intersects[0]?.object;

    if (intersectedObject && intersectedObject.name === 'wall2') {
      setImagenIndex((imagenIndex + 1) % imagenes.length);
    }
  };

  return (
    <group scale={100} >
      <mesh receiveShadow={true} position-y={0.5} position-x={4} position-z={-0.06} rotation-x={-Math.PI * 0.5} name="wall1" onClick={handlePlaneClick}>
        <boxGeometry args={[0.25, 8.14, 4]} />
        <Suspense fallback={<FallbackMaterial url="10.jpg" />}>
        {videoLoaded && <VideoMaterial url="10.webm" />}
      </Suspense>
      </mesh>
      <mesh receiveShadow={true} position-y={0.5} position-z={-4} position-x={-0.06} rotation-z={4.72} rotation-x={-Math.PI * 0.5} name="wall2" onPointerEnter={handleClick}>
        <boxGeometry args={[0.25, 7.86, 4]} />
        <meshStandardMaterial map={texture} shouldUpdate={true} />
      </mesh>
  </group>
  )
}

function VideoMaterial({ url }) {
  const texture = useVideoTexture(url)
  return <meshBasicMaterial map={texture} toneMapped={false} />
}

function FallbackMaterial({ url }) {
  const texture = useTexture(url)
  return <meshBasicMaterial map={texture} toneMapped={false} />
}

