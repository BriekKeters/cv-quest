import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MathUtils, Vector3 } from 'three'
import { input } from './input'
import { COLLIDERS, INTERACT_RADIUS, SPAWN, WALK_RADIUS, ZONES } from './zones'
import { useGame } from '../state/store'

const SPEED = 9
export const CAM_OFFSET = new Vector3(0, 11.5, 16.5)

const camTarget = new Vector3()
const lookTarget = new Vector3()

export function Player() {
  const group = useRef<Group>(null)
  const body = useRef<Group>(null)
  const heading = useRef(Math.PI) // face the camera at spawn
  const walkTime = useRef(0)

  useFrame((state, rawDt) => {
    const g = group.current
    if (!g) return
    const dt = Math.min(rawDt, 0.05)
    const { activeZone, sheetOpen, cvOpen, screen, nearZone, setNearZone } =
      useGame.getState()
    const frozen = screen !== 'world' || !!activeZone || sheetOpen || cvOpen

    let dx = 0
    let dz = 0
    if (!frozen) {
      dx = input.keyX + input.joyX
      dz = input.keyZ + input.joyZ
      const len = Math.hypot(dx, dz)
      if (len > 1) {
        dx /= len
        dz /= len
      }
    }
    const moving = Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01

    if (moving) {
      g.position.x += dx * SPEED * dt
      g.position.z += dz * SPEED * dt

      // island edge
      const fromCenter = Math.hypot(g.position.x, g.position.z)
      if (fromCenter > WALK_RADIUS) {
        const scale = WALK_RADIUS / fromCenter
        g.position.x *= scale
        g.position.z *= scale
      }

      // push out of props
      for (const c of COLLIDERS) {
        const cx = g.position.x - c.x
        const cz = g.position.z - c.z
        const d = Math.hypot(cx, cz)
        const minD = c.r + 0.5
        if (d > 0.0001 && d < minD) {
          g.position.x = c.x + (cx / d) * minD
          g.position.z = c.z + (cz / d) * minD
        }
      }

      // face the walk direction (shortest-arc turn)
      const target = Math.atan2(dx, dz)
      let diff = target - heading.current
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      heading.current += diff * Math.min(1, dt * 14)
      walkTime.current += dt
    }
    g.rotation.y = heading.current

    // walk bob
    if (body.current) {
      body.current.position.y = moving
        ? Math.abs(Math.sin(walkTime.current * 9)) * 0.18
        : MathUtils.lerp(body.current.position.y, 0, dt * 8)
      body.current.rotation.x = moving ? Math.sin(walkTime.current * 9) * 0.05 : 0
    }

    // nearest interactable zone
    let nearest: (typeof ZONES)[number] | null = null
    let nearestD = Infinity
    for (const zone of ZONES) {
      const d = Math.hypot(g.position.x - zone.x, g.position.z - zone.z)
      if (d < nearestD) {
        nearestD = d
        nearest = zone
      }
    }
    const nearId = nearest && nearestD <= INTERACT_RADIUS ? nearest.id : null
    if (nearId !== nearZone) setNearZone(nearId)

    if (import.meta.env.DEV) {
      ;(window as unknown as Record<string, unknown>).__debug = {
        pos: [g.position.x.toFixed(1), g.position.z.toFixed(1)],
        near: nearZone,
        input: [input.keyX, input.keyZ, input.joyX, input.joyZ],
      }
    }

    // chase camera
    camTarget.copy(g.position).add(CAM_OFFSET)
    const smooth = 1 - Math.exp(-4 * dt)
    state.camera.position.lerp(camTarget, smooth)
    lookTarget.set(g.position.x, g.position.y + 2.2, g.position.z)
    state.camera.lookAt(lookTarget)
  })

  return (
    <group ref={group} position={[SPAWN.x, 0, SPAWN.z]}>
      <group ref={body}>
        {/* feet */}
        <mesh castShadow position={[-0.2, 0.16, 0]}>
          <sphereGeometry args={[0.17, 12, 12]} />
          <meshStandardMaterial color="#2f3a4f" />
        </mesh>
        <mesh castShadow position={[0.2, 0.16, 0]}>
          <sphereGeometry args={[0.17, 12, 12]} />
          <meshStandardMaterial color="#2f3a4f" />
        </mesh>
        {/* tunic */}
        <mesh castShadow position={[0, 0.95, 0]}>
          <capsuleGeometry args={[0.42, 0.55, 6, 14]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
        {/* belt */}
        <mesh castShadow position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.44, 0.44, 0.12, 16]} />
          <meshStandardMaterial color="#b4834b" />
        </mesh>
        {/* head */}
        <mesh castShadow position={[0, 1.78, 0]}>
          <sphereGeometry args={[0.38, 20, 20]} />
          <meshStandardMaterial color="#f3c8a2" />
        </mesh>
        {/* eyes */}
        <mesh position={[-0.14, 1.82, 0.32]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.14, 1.82, 0.32]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* hair */}
        <mesh castShadow position={[0, 1.95, -0.03]} scale={[1, 0.62, 1]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#6b4a2f" />
        </mesh>
        {/* backpack */}
        <mesh castShadow position={[0, 1.05, -0.42]}>
          <boxGeometry args={[0.55, 0.62, 0.3]} />
          <meshStandardMaterial color="#8b5e34" />
        </mesh>
      </group>
    </group>
  )
}
