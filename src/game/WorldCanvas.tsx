import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { World } from './World'

// Default-exported so App can lazy-load the whole three.js bundle.
export default function WorldCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 48, position: [0, 15, 31], near: 0.5, far: 300 }}
    >
      <Suspense fallback={null}>
        <World />
      </Suspense>
    </Canvas>
  )
}
