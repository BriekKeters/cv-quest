import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import { Group, MathUtils, Mesh, Vector3 } from 'three'
import type { ZoneDef } from './zones'
import { ZONE_LABELS } from '../data/cv'
import { useGame } from '../state/store'
import { CAM_OFFSET } from './Player'

/**
 * Pops its children in when the player is inside/near the zone circle and
 * hides them at a distance, so labels never clip through buildings while
 * roaming. The pivot sits at label height (y), so the scale animation grows
 * the label in place instead of dragging it through the building below.
 * Player position is derived from the chase camera to avoid extra state.
 */
function FloatingInfo({
  zx,
  zz,
  y,
  children,
}: {
  zx: number
  zz: number
  y: number
  children: React.ReactNode
}) {
  const ref = useRef<Group>(null)
  useFrame(({ camera }, dt) => {
    const g = ref.current
    if (!g) return
    const px = camera.position.x - CAM_OFFSET.x
    const pz = camera.position.z - CAM_OFFSET.z
    const d = Math.hypot(px - zx, pz - zz)
    const target = MathUtils.clamp((11 - d) / 4, 0, 1) // 1 inside the ring, 0 beyond ~11
    const s = MathUtils.lerp(g.scale.x, target, Math.min(1, dt * 10))
    g.scale.setScalar(Math.max(s, 0.001))
    g.visible = s > 0.02
  })
  return (
    <group position-y={y} ref={ref}>
      {children}
    </group>
  )
}

/* ---------- shared bits ---------- */

const markerWorldPos = new Vector3()

function QuestMarker({ visited, y = 7 }: { visited: boolean; y?: number }) {
  const group = useRef<Group>(null)
  useFrame((state) => {
    const g = group.current
    if (!g) return
    g.position.y = y + Math.sin(state.clock.elapsedTime * 2.2) * 0.25
    // the chase camera can pass right through a marker; hide it rather than
    // letting it balloon across the screen
    g.getWorldPosition(markerWorldPos)
    g.visible = state.camera.position.distanceTo(markerWorldPos) > 7
  })
  return (
    <group ref={group} position-y={y}>
      {visited ? (
        <mesh>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={0.8} />
        </mesh>
      ) : (
        <>
          <mesh position-y={0.42}>
            <cylinderGeometry args={[0.1, 0.13, 0.62, 10]} />
            <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.9} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.14, 12, 12]} />
            <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.9} />
          </mesh>
        </>
      )}
    </group>
  )
}

function ZoneLabel({ zone }: { zone: ZoneDef }) {
  const lang = useGame((s) => s.lang)
  const label = ZONE_LABELS[zone.id]
  return (
    <Billboard>
      <Text
        fontSize={0.95}
        color="#ffffff"
        outlineWidth={0.06}
        outlineColor="#0b1020"
        anchorY="bottom"
      >
        {label.name}
      </Text>
      <Text
        position-y={-0.15}
        fontSize={0.52}
        color="#e0b458"
        outlineWidth={0.045}
        outlineColor="#0b1020"
        anchorY="top"
      >
        {label.sub[lang]}
      </Text>
    </Billboard>
  )
}

function ZoneRing({ color, visited }: { color: string; visited: boolean }) {
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position-y={0.02}>
        <circleGeometry args={[5.4, 40]} />
        <meshStandardMaterial color="#5cae43" />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.04}>
        <ringGeometry args={[5.0, 5.4, 48]} />
        <meshBasicMaterial color={visited ? '#34d399' : color} transparent opacity={0.85} />
      </mesh>
    </>
  )
}

/* ---------- decorations ---------- */

export function Tree({ x, z, s, v }: { x: number; z: number; s: number; v: number }) {
  const leaf = v > 0.5 ? '#3f9142' : '#57a84c'
  return (
    <group position={[x, 0, z]} scale={s} rotation-y={v * Math.PI * 2}>
      <mesh castShadow position-y={0.9}>
        <cylinderGeometry args={[0.22, 0.32, 1.8, 8]} />
        <meshStandardMaterial color="#7a543a" />
      </mesh>
      <mesh castShadow position-y={2.6}>
        <coneGeometry args={[1.5, 2.6, 8]} />
        <meshStandardMaterial color={leaf} flatShading />
      </mesh>
      <mesh castShadow position-y={3.9}>
        <coneGeometry args={[1.0, 1.9, 8]} />
        <meshStandardMaterial color={leaf} flatShading />
      </mesh>
    </group>
  )
}

export function Rock({ x, z, s, v }: { x: number; z: number; s: number; v: number }) {
  return (
    <mesh
      castShadow
      position={[x, 0.3 * s, z]}
      scale={[s, s * 0.6, s]}
      rotation-y={v * Math.PI * 2}
    >
      <dodecahedronGeometry args={[0.9, 0]} />
      <meshStandardMaterial color="#9aa3b2" flatShading />
    </mesh>
  )
}

export function PathDot({ x, z, s }: { x: number; z: number; s: number }) {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[x, 0.015, z]}>
      <circleGeometry args={[s, 10]} />
      <meshStandardMaterial color="#d8c49a" />
    </mesh>
  )
}

export function Cloud({ x, y, z, s }: { x: number; y: number; z: number; s: number }) {
  const group = useRef<Group>(null)
  useFrame((state) => {
    if (group.current) {
      group.current.position.x = x + Math.sin(state.clock.elapsedTime * 0.15 + z) * 2.5
    }
  })
  return (
    <group ref={group} position={[x, y, z]} scale={s}>
      <mesh>
        <sphereGeometry args={[1.6, 12, 12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[1.4, -0.2, 0.2]}>
        <sphereGeometry args={[1.1, 12, 12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-1.4, -0.25, -0.1]}>
        <sphereGeometry args={[1.2, 12, 12]} />
        <meshStandardMaterial color="#f4f7fb" />
      </mesh>
    </group>
  )
}

/* ---------- zone buildings ---------- */

function HowestArcade() {
  return (
    <group>
      {/* cabinet */}
      <mesh castShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[2.2, 3.0, 1.6]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* screen */}
      <mesh position={[0, 2.1, 0.82]}>
        <planeGeometry args={[1.6, 1.1]} />
        <meshStandardMaterial color="#0ea5b7" emissive="#22d3ee" emissiveIntensity={1.4} />
      </mesh>
      {/* control deck */}
      <mesh castShadow position={[0, 1.25, 0.95]} rotation-x={-0.5}>
        <boxGeometry args={[2.0, 0.18, 0.9]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh position={[-0.45, 1.55, 1.1]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0.35, 1.48, 1.12]}>
        <cylinderGeometry args={[0.11, 0.11, 0.08, 12]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0.7, 1.44, 1.18]}>
        <cylinderGeometry args={[0.11, 0.11, 0.08, 12]} />
        <meshStandardMaterial color="#34d399" />
      </mesh>
      {/* marquee */}
      <mesh castShadow position={[0, 3.2, 0.2]}>
        <boxGeometry args={[2.3, 0.5, 1.7]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.4} />
      </mesh>
      {/* big game controller on the ground */}
      <group position={[2.6, 0.35, 1.6]} rotation-y={-0.6}>
        <mesh castShadow>
          <boxGeometry args={[1.6, 0.35, 0.8]} />
          <meshStandardMaterial color="#e5e7eb" />
        </mesh>
        <mesh position={[-0.45, 0.24, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.12, 10]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        <mesh position={[0.45, 0.24, 0]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0.62, 0.24, 0.18]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
      </group>
    </group>
  )
}

function Rabbit({ cx, cz }: { cx: number; cz: number }) {
  const group = useRef<Group>(null)
  useFrame((state) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime * 0.55
    const r = 2.6
    g.position.set(cx + Math.cos(t) * r, Math.abs(Math.sin(t * 6)) * 0.45, cz + Math.sin(t) * r)
    g.rotation.y = -t - Math.PI / 2
  })
  return (
    <group ref={group}>
      <mesh castShadow position-y={0.32}>
        <sphereGeometry args={[0.32, 14, 14]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh castShadow position={[0, 0.62, 0.2]}>
        <sphereGeometry args={[0.22, 14, 14]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh castShadow position={[-0.09, 0.95, 0.16]} rotation-z={0.15}>
        <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh castShadow position={[0.09, 0.95, 0.16]} rotation-z={-0.15}>
        <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* RabbitMQ-orange scarf */}
      <mesh position={[0, 0.5, 0.14]}>
        <cylinderGeometry args={[0.19, 0.19, 0.1, 12]} />
        <meshStandardMaterial color="#ff6600" />
      </mesh>
      <mesh position={[0, 0.28, -0.28]}>
        <sphereGeometry args={[0.11, 10, 10]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

function FodBuilding() {
  return (
    <group>
      {/* steps */}
      <mesh castShadow receiveShadow position={[0, 0.15, 1.9]}>
        <boxGeometry args={[4.4, 0.3, 1.4]} />
        <meshStandardMaterial color="#b6bec9" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.42, 1.55]}>
        <boxGeometry args={[4.0, 0.3, 1.0]} />
        <meshStandardMaterial color="#aab3bf" />
      </mesh>
      {/* main block */}
      <mesh castShadow position={[0, 2.1, 0]}>
        <boxGeometry args={[4.6, 3.2, 3.2]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      {/* columns */}
      {[-1.6, -0.55, 0.55, 1.6].map((x) => (
        <mesh key={x} castShadow position={[x, 1.85, 1.75]}>
          <cylinderGeometry args={[0.17, 0.17, 2.6, 10]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      ))}
      {/* pediment */}
      <mesh castShadow position={[0, 4.1, 0]} rotation-y={Math.PI / 4}>
        <coneGeometry args={[3.3, 1.1, 4]} />
        <meshStandardMaterial color="#7c8aa0" flatShading />
      </mesh>
      {/* Belgian flag */}
      <group position={[3.0, 0, 2.4]}>
        <mesh castShadow position-y={1.6}>
          <cylinderGeometry args={[0.05, 0.05, 3.2, 8]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[0.28, 2.85, 0]}>
          <boxGeometry args={[0.5, 0.55, 0.04]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        <mesh position={[0.78, 2.85, 0]}>
          <boxGeometry args={[0.5, 0.55, 0.04]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
        <mesh position={[1.28, 2.85, 0]}>
          <boxGeometry args={[0.5, 0.55, 0.04]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </group>
      {/* Docker crates */}
      <group position={[-3.2, 0, 1.8]}>
        {[
          [0, 0.35, 0],
          [0.85, 0.35, 0.1],
          [-0.85, 0.35, -0.1],
          [0.4, 1.05, 0],
          [-0.45, 1.05, -0.05],
          [0, 1.75, 0],
        ].map(([x, y, z], i) => (
          <mesh key={i} castShadow position={[x, y, z]}>
            <boxGeometry args={[0.8, 0.7, 0.8]} />
            <meshStandardMaterial color={i % 2 ? '#1d63ed' : '#2b7fff'} />
          </mesh>
        ))}
      </group>
      <Rabbit cx={0} cz={4.6} />
    </group>
  )
}

function ElmosBuilding() {
  return (
    <group>
      <mesh castShadow position={[0, 1.7, 0]}>
        <boxGeometry args={[3.8, 3.0, 3.0]} />
        <meshStandardMaterial color="#8b5cf6" />
      </mesh>
      {/* roof */}
      <mesh castShadow position={[0, 3.65, 0]} rotation-y={Math.PI / 4}>
        <coneGeometry args={[2.9, 1.4, 4]} />
        <meshStandardMaterial color="#6d28d9" flatShading />
      </mesh>
      {/* door + windows */}
      <mesh position={[0, 0.95, 1.52]}>
        <boxGeometry args={[0.9, 1.7, 0.06]} />
        <meshStandardMaterial color="#ede9fe" />
      </mesh>
      <mesh position={[-1.15, 2.2, 1.52]}>
        <boxGeometry args={[0.75, 0.75, 0.06]} />
        <meshStandardMaterial color="#c4b5fd" emissive="#a78bfa" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[1.15, 2.2, 1.52]}>
        <boxGeometry args={[0.75, 0.75, 0.06]} />
        <meshStandardMaterial color="#c4b5fd" emissive="#a78bfa" emissiveIntensity={0.35} />
      </mesh>
      {/* graduation cap on the roof (the training arc) */}
      <group position={[0, 4.6, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.42, 0.5, 0.35, 12]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh castShadow position-y={0.22} rotation-y={0.4}>
          <boxGeometry args={[1.5, 0.09, 1.5]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        <mesh position={[0.7, 0.12, 0.7]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      </group>
    </group>
  )
}

function LiantisOffice() {
  return (
    <group>
      {/* two glass towers with a bridge */}
      <mesh castShadow position={[-1.3, 2.3, 0]}>
        <boxGeometry args={[2.3, 4.6, 2.3]} />
        <meshStandardMaterial color="#60a5fa" metalness={0.35} roughness={0.25} />
      </mesh>
      <mesh castShadow position={[1.6, 1.7, 0.4]}>
        <boxGeometry args={[2.0, 3.4, 2.0]} />
        <meshStandardMaterial color="#7dd3fc" metalness={0.35} roughness={0.25} />
      </mesh>
      <mesh castShadow position={[0.1, 2.5, 0.2]}>
        <boxGeometry args={[1.4, 0.55, 1.1]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      {/* floor trims */}
      {[1.1, 2.3, 3.5].map((y) => (
        <mesh key={y} position={[-1.3, y, 0]}>
          <boxGeometry args={[2.36, 0.09, 2.36]} />
          <meshStandardMaterial color="#eff6ff" />
        </mesh>
      ))}
      {[0.9, 2.0].map((y) => (
        <mesh key={y} position={[1.6, y, 0.4]}>
          <boxGeometry args={[2.06, 0.09, 2.06]} />
          <meshStandardMaterial color="#eff6ff" />
        </mesh>
      ))}
      {/* pennant */}
      <group position={[-1.3, 4.6, 0]}>
        <mesh castShadow position-y={0.8}>
          <cylinderGeometry args={[0.05, 0.05, 1.6, 8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0.42, 1.35, 0]} rotation-z={-Math.PI / 2}>
          <coneGeometry args={[0.22, 0.8, 4]} />
          <meshStandardMaterial color="#e0b458" emissive="#b48a2c" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </group>
  )
}

function VivesTent() {
  return (
    <group>
      <mesh castShadow position={[0, 1.5, 0]} rotation-y={Math.PI / 4}>
        <coneGeometry args={[2.9, 3.0, 4]} />
        <meshStandardMaterial color="#f8fafc" flatShading />
      </mesh>
      {/* entrance */}
      <mesh position={[0, 0.85, 1.48]} rotation-y={0}>
        <boxGeometry args={[1.0, 1.7, 0.06]} />
        <meshStandardMaterial color="#dbe3ee" />
      </mesh>
      {/* red cross sign */}
      <group position={[0, 3.35, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.32, 1.0, 0.32]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.5} />
        </mesh>
        <mesh castShadow>
          <boxGeometry args={[1.0, 0.32, 0.32]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.5} />
        </mesh>
      </group>
      {/* potion crate */}
      <group position={[2.2, 0, 1.2]}>
        <mesh castShadow position-y={0.3}>
          <boxGeometry args={[0.9, 0.6, 0.9]} />
          <meshStandardMaterial color="#b48a5c" />
        </mesh>
        <mesh castShadow position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.14, 0.2, 0.34, 10]} />
          <meshStandardMaterial color="#f472b6" emissive="#ec4899" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  )
}

function SkillOrb({ x, y, z, i }: { x: number; y: number; z: number; i: number }) {
  const ref = useRef<Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime
      ref.current.position.y = y + Math.sin(t * 1.6 + i * 1.3) * 0.25
      const s = 1 + Math.sin(t * 2.4 + i) * 0.12
      ref.current.scale.setScalar(s)
    }
  })
  return (
    <mesh ref={ref} position={[x, y, z]}>
      <sphereGeometry args={[0.28, 14, 14]} />
      <meshStandardMaterial color="#fde68a" emissive="#f59e0b" emissiveIntensity={1.3} />
    </mesh>
  )
}

function BigSkillTree() {
  return (
    <group>
      <mesh castShadow position-y={1.6}>
        <cylinderGeometry args={[0.55, 0.85, 3.2, 10]} />
        <meshStandardMaterial color="#7a543a" />
      </mesh>
      <mesh castShadow position={[0, 4.0, 0]}>
        <sphereGeometry args={[2.3, 16, 16]} />
        <meshStandardMaterial color="#2f9e44" flatShading />
      </mesh>
      <mesh castShadow position={[1.5, 3.2, 0.6]}>
        <sphereGeometry args={[1.5, 14, 14]} />
        <meshStandardMaterial color="#37b24d" flatShading />
      </mesh>
      <mesh castShadow position={[-1.6, 3.4, -0.4]}>
        <sphereGeometry args={[1.4, 14, 14]} />
        <meshStandardMaterial color="#37b24d" flatShading />
      </mesh>
      <SkillOrb x={1.9} y={2.6} z={1.2} i={0} />
      <SkillOrb x={-2.1} y={2.9} z={0.6} i={1} />
      <SkillOrb x={0.4} y={2.3} z={1.9} i={2} />
      <SkillOrb x={-0.9} y={2.5} z={-1.7} i={3} />
      <SkillOrb x={2.3} y={3.6} z={-0.8} i={4} />
    </group>
  )
}

function GhentTower() {
  return (
    <group>
      {/* base */}
      <mesh castShadow receiveShadow position-y={0.6}>
        <boxGeometry args={[3.2, 1.2, 3.2]} />
        <meshStandardMaterial color="#b8a88a" />
      </mesh>
      {/* tower shaft */}
      <mesh castShadow position-y={3.6}>
        <boxGeometry args={[1.9, 5.0, 1.9]} />
        <meshStandardMaterial color="#d6c7a8" />
      </mesh>
      {/* clock face */}
      <mesh position={[0, 5.2, 0.98]}>
        <circleGeometry args={[0.55, 20]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, 5.35, 1.0]}>
        <boxGeometry args={[0.07, 0.4, 0.02]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.14, 5.16, 1.0]} rotation-z={-1.1}>
        <boxGeometry args={[0.06, 0.3, 0.02]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* spire */}
      <mesh castShadow position-y={6.9} rotation-y={Math.PI / 4}>
        <coneGeometry args={[1.5, 1.6, 4]} />
        <meshStandardMaterial color="#64748b" flatShading />
      </mesh>
      {/* engineering gear on a stand */}
      <group position={[2.3, 0, 1.4]}>
        <mesh castShadow position-y={0.5}>
          <boxGeometry args={[0.3, 1.0, 0.3]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
        <mesh castShadow position-y={1.35} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.75, 0.75, 0.25, 10]} />
          <meshStandardMaterial color="#9ca3af" flatShading />
        </mesh>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i / 8) * Math.PI * 2
          return (
            <mesh
              key={i}
              castShadow
              position={[Math.cos(a) * 0.82, 1.35 + Math.sin(a) * 0.82, 0]}
              rotation-z={a}
            >
              <boxGeometry args={[0.28, 0.24, 0.22]} />
              <meshStandardMaterial color="#9ca3af" />
            </mesh>
          )
        })}
        <mesh position={[0, 1.35, 0.14]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 10]} />
          <meshStandardMaterial color="#4b5563" />
        </mesh>
      </group>
      {/* stack of books */}
      <group position={[-2.2, 0, 1.6]} rotation-y={0.4}>
        <mesh castShadow position-y={0.12}>
          <boxGeometry args={[1.0, 0.24, 0.7]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
        <mesh castShadow position-y={0.36} rotation-y={0.25}>
          <boxGeometry args={[0.9, 0.22, 0.65]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh castShadow position-y={0.58} rotation-y={-0.2}>
          <boxGeometry args={[0.85, 0.2, 0.6]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
      </group>
    </group>
  )
}

function StallAwning({ color }: { color: string }) {
  return (
    <mesh castShadow position-y={2.15} rotation-x={-0.25}>
      <boxGeometry args={[2.0, 0.12, 1.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function ProjectStall({
  x,
  z,
  ry,
  color,
}: {
  x: number
  z: number
  ry: number
  color: string
}) {
  return (
    <group position={[x, 0, z]} rotation-y={ry}>
      {[-0.85, 0.85].map((px) => (
        <mesh key={px} castShadow position={[px, 1.05, -0.5]}>
          <cylinderGeometry args={[0.07, 0.09, 2.1, 8]} />
          <meshStandardMaterial color="#8b5e34" />
        </mesh>
      ))}
      <mesh castShadow position={[0, 0.55, 0.1]}>
        <boxGeometry args={[1.9, 0.5, 0.9]} />
        <meshStandardMaterial color="#a9773f" />
      </mesh>
      <mesh castShadow position={[0, 0.95, 0.1]}>
        <boxGeometry args={[1.95, 0.1, 1.0]} />
        <meshStandardMaterial color="#c99a5b" />
      </mesh>
      <StallAwning color={color} />
    </group>
  )
}

function ProjectsWorkshop() {
  return (
    <group>
      <ProjectStall x={-2.2} z={0.4} ry={0.5} color="#ef4444" />
      <ProjectStall x={0} z={-0.8} ry={0} color="#14b8a6" />
      <ProjectStall x={2.2} z={0.4} ry={-0.5} color="#8b5cf6" />
      {/* central workbench with a laptop */}
      <group position={[0, 0, 2.4]}>
        <mesh castShadow position-y={0.5}>
          <boxGeometry args={[1.5, 0.12, 0.9]} />
          <meshStandardMaterial color="#8b5e34" />
        </mesh>
        {[-0.6, 0.6].map((px) => (
          <mesh key={px} castShadow position={[px, 0.22, 0]}>
            <boxGeometry args={[0.12, 0.45, 0.7]} />
            <meshStandardMaterial color="#6b4a2f" />
          </mesh>
        ))}
        <mesh castShadow position={[0, 0.6, 0.05]}>
          <boxGeometry args={[0.7, 0.05, 0.45]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh castShadow position={[0, 0.82, -0.16]} rotation-x={-0.35}>
          <boxGeometry args={[0.7, 0.45, 0.04]} />
          <meshStandardMaterial color="#0ea5b7" emissive="#22d3ee" emissiveIntensity={0.9} />
        </mesh>
      </group>
    </group>
  )
}

function StudioSet() {
  return (
    <group>
      {/* backdrop screen */}
      <group position={[0, 0, -1.6]}>
        {[-1.7, 1.7].map((px) => (
          <mesh key={px} castShadow position={[px, 1.3, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 2.6, 8]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        ))}
        <mesh castShadow position={[0, 1.55, 0]}>
          <boxGeometry args={[3.5, 2.1, 0.08]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
      </group>
      {/* camera on tripod */}
      <group position={[0.4, 0, 1.7]} rotation-y={Math.PI}>
        {[-0.5, 0.5, 0].map((px, i) => (
          <mesh
            key={i}
            castShadow
            position={[px * 0.7, 0.65, i === 2 ? -0.45 : 0.25]}
            rotation-z={px * 0.45}
            rotation-x={i === 2 ? -0.4 : 0.2}
          >
            <cylinderGeometry args={[0.05, 0.05, 1.4, 8]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        ))}
        <mesh castShadow position={[0, 1.45, 0]}>
          <boxGeometry args={[0.55, 0.42, 0.42]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh castShadow position={[0, 1.45, 0.34]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.16, 0.19, 0.35, 12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 1.45, 0.52]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.12, 0.12, 0.02, 12]} />
          <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.7} />
        </mesh>
      </group>
      {/* spotlight */}
      <group position={[-1.9, 0, 1.2]} rotation-y={0.7}>
        <mesh castShadow position-y={1.0}>
          <cylinderGeometry args={[0.06, 0.08, 2.0, 8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh castShadow position={[0, 2.05, 0.15]} rotation-x={0.5}>
          <cylinderGeometry args={[0.32, 0.42, 0.5, 12]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 1.93, 0.42]} rotation-x={0.5 + Math.PI / 2}>
          <circleGeometry args={[0.3, 14]} />
          <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={1.4} />
        </mesh>
      </group>
      {/* clapperboard leaning on the ground */}
      <group position={[1.6, 0, 0.4]} rotation-y={-0.7} rotation-x={0.35}>
        <mesh castShadow position-y={0.35}>
          <boxGeometry args={[0.8, 0.6, 0.06]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh castShadow position-y={0.72} rotation-z={0.12}>
          <boxGeometry args={[0.82, 0.16, 0.07]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>
      {/* giant phone (the app-dev half) */}
      <group position={[-1.3, 0, 2.6]} rotation-y={0.4}>
        <mesh castShadow position-y={0.95}>
          <boxGeometry args={[1.0, 1.9, 0.14]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 0.98, 0.08]}>
          <boxGeometry args={[0.86, 1.6, 0.02]} />
          <meshStandardMaterial color="#c026d3" emissive="#e879f9" emissiveIntensity={0.7} />
        </mesh>
      </group>
    </group>
  )
}

function Mailbox() {
  const env = useRef<Mesh>(null)
  useFrame((state) => {
    if (env.current) {
      env.current.position.y = 2.2 + Math.sin(state.clock.elapsedTime * 1.8) * 0.15
      env.current.rotation.y = state.clock.elapsedTime * 0.8
    }
  })
  return (
    <group>
      <mesh castShadow position-y={0.65}>
        <cylinderGeometry args={[0.09, 0.09, 1.3, 8]} />
        <meshStandardMaterial color="#6b4a2f" />
      </mesh>
      <mesh castShadow position-y={1.45}>
        <boxGeometry args={[0.85, 0.6, 0.55]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[0, 1.45, 0.29]}>
        <boxGeometry args={[0.5, 0.34, 0.03]} />
        <meshStandardMaterial color="#7f1d1d" />
      </mesh>
      <mesh castShadow position={[0.5, 1.75, 0]} rotation-z={0.5}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#e0b458" />
      </mesh>
      <mesh ref={env} castShadow position-y={2.2}>
        <boxGeometry args={[0.55, 0.38, 0.05]} />
        <meshStandardMaterial color="#f8fafc" emissive="#94a3b8" emissiveIntensity={0.15} />
      </mesh>
    </group>
  )
}

/**
 * Flat triangular arrowhead for the signpost: a 3-sided prism the same
 * depth as the board, so it reads as a triangle head-on rather than as a
 * pyramid. Nested groups keep the two rotations independent of Euler order:
 * the inner one lays the prism's axis along Z, the outer aims the tip at -X.
 */
function SignArrowHead({ color }: { color: string }) {
  return (
    <group rotation-z={-Math.PI / 2}>
      <mesh castShadow rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.33, 0.33, 0.09, 3]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

export function SpawnSign() {
  const lang = useGame((s) => s.lang)
  return (
    <group position={[-3.2, 0, 11.5]} rotation-y={0.2}>
      <mesh castShadow position-y={1.1}>
        <cylinderGeometry args={[0.09, 0.12, 2.2, 8]} />
        <meshStandardMaterial color="#6b4a2f" />
      </mesh>
      {/* top board: points west toward Howest, the first quest */}
      <group position={[0, 1.85, 0.14]}>
        <mesh castShadow>
          <boxGeometry args={[1.9, 0.52, 0.09]} />
          <meshStandardMaterial color="#c99a5b" />
        </mesh>
        <group position={[-1.11, 0, 0]}>
          <SignArrowHead color="#c99a5b" />
        </group>
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.3}
          color="#3b2a1a"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {lang === 'nl' ? 'Start hier' : 'Start here'}
        </Text>
      </group>
      {/* lower board: where the path leads */}
      <group position={[0, 1.28, 0.14]}>
        <mesh castShadow>
          <boxGeometry args={[1.7, 0.42, 0.09]} />
          <meshStandardMaterial color="#b4834b" />
        </mesh>
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.21}
          color="#3b2a1a"
          anchorX="center"
          anchorY="middle"
        >
          Howest · 2018
        </Text>
      </group>
    </group>
  )
}

/* ---------- zone assembly ---------- */

const BUILDINGS: Record<ZoneDef['id'], () => React.ReactElement> = {
  howest: HowestArcade,
  ghent: GhentTower,
  fod: FodBuilding,
  elmos: ElmosBuilding,
  liantis: LiantisOffice,
  vives: VivesTent,
  studio: StudioSet,
  projects: ProjectsWorkshop,
  skills: BigSkillTree,
  contact: Mailbox,
}

const MARKER_Y: Partial<Record<ZoneDef['id'], number>> = {
  contact: 3.2,
  ghent: 9.6,
  studio: 3.4,
  projects: 3.4,
  elmos: 7.9,
  liantis: 8.7,
  skills: 9.3,
}

// Zones with tall props get their floating label raised so the building
// never occludes the text at the chase-camera angle.
const LABEL_Y: Partial<Record<ZoneDef['id'], number>> = {
  ghent: 8.2,
  elmos: 6.2,
  liantis: 6.8,
  skills: 7.2,
}

export function Zone({ def }: { def: ZoneDef }) {
  const visited = useGame((s) => s.visited.includes(def.id))
  const Building = BUILDINGS[def.id]
  const markerY = MARKER_Y[def.id] ?? 6.6
  return (
    <group position={[def.x, 0, def.z]}>
      <ZoneRing color={def.color} visited={visited} />
      <Building />
      <FloatingInfo zx={def.x} zz={def.z} y={LABEL_Y[def.id] ?? 5.4}>
        <ZoneLabel zone={def} />
      </FloatingInfo>
      <QuestMarker visited={visited} y={markerY} />
    </group>
  )
}
