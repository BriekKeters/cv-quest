import { ISLAND_RADIUS, PATH_DOTS, ROCKS, TREES, ZONES } from './zones'
import { Cloud, PathDot, Rock, SpawnSign, Tree, Zone } from './props'
import { Player } from './Player'

export function World() {
  return (
    <>
      <color attach="background" args={['#87c5eb']} />
      <fog attach="fog" args={['#87c5eb', 55, 130]} />

      <ambientLight intensity={0.75} />
      <directionalLight
        castShadow
        position={[35, 45, 20]}
        intensity={1.6}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-camera-far={140}
        shadow-bias={-0.0004}
      />
      <hemisphereLight args={['#bde3ff', '#4c7a3d', 0.5]} />

      {/* island */}
      <mesh receiveShadow position-y={-1}>
        <cylinderGeometry args={[ISLAND_RADIUS, ISLAND_RADIUS - 3, 2, 56]} />
        <meshStandardMaterial color="#69bd4f" />
      </mesh>
      {/* cliff base */}
      <mesh position-y={-3.4}>
        <cylinderGeometry args={[ISLAND_RADIUS - 2.6, ISLAND_RADIUS - 8, 3.4, 56]} />
        <meshStandardMaterial color="#8a6a48" flatShading />
      </mesh>
      {/* sandy rim */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.005}>
        <ringGeometry args={[ISLAND_RADIUS - 3.4, ISLAND_RADIUS, 56]} />
        <meshStandardMaterial color="#dcc890" />
      </mesh>
      {/* sea */}
      <mesh rotation-x={-Math.PI / 2} position-y={-2.6}>
        <circleGeometry args={[220, 48]} />
        <meshStandardMaterial color="#3f9ad1" />
      </mesh>

      {PATH_DOTS.map((d, i) => (
        <PathDot key={i} {...d} />
      ))}
      {TREES.map((t, i) => (
        <Tree key={i} {...t} />
      ))}
      {ROCKS.map((r, i) => (
        <Rock key={i} {...r} />
      ))}

      <Cloud x={-25} y={18} z={-30} s={1.4} />
      <Cloud x={20} y={22} z={-45} s={1.9} />
      <Cloud x={38} y={16} z={18} s={1.1} />
      <Cloud x={-38} y={20} z={22} s={1.5} />

      <SpawnSign />

      {ZONES.map((z) => (
        <Zone key={z.id} def={z} />
      ))}

      <Player />
    </>
  )
}
