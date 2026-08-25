// Shared input singleton, written by keyboard listeners and the touch
// joystick, read every frame by the Player. Kept outside React state so
// movement never triggers re-renders.
//
// Keyboard uses e.code (physical key position), so WASD automatically
// works as ZQSD on Belgian AZERTY keyboards.

export const input = {
  keyX: 0,
  keyZ: 0,
  joyX: 0,
  joyZ: 0,
}

const pressed = new Set<string>()

const LEFT = ['KeyA', 'ArrowLeft']
const RIGHT = ['KeyD', 'ArrowRight']
const UP = ['KeyW', 'ArrowUp']
const DOWN = ['KeyS', 'ArrowDown']

function recompute() {
  const has = (codes: string[]) => codes.some((c) => pressed.has(c))
  input.keyX = (has(RIGHT) ? 1 : 0) - (has(LEFT) ? 1 : 0)
  input.keyZ = (has(DOWN) ? 1 : 0) - (has(UP) ? 1 : 0)
}

export function bindKeyboard(): () => void {
  const down = (e: KeyboardEvent) => {
    if ([...LEFT, ...RIGHT, ...UP, ...DOWN].includes(e.code)) {
      e.preventDefault()
      pressed.add(e.code)
      recompute()
    }
  }
  const up = (e: KeyboardEvent) => {
    pressed.delete(e.code)
    recompute()
  }
  const blur = () => {
    pressed.clear()
    recompute()
  }
  window.addEventListener('keydown', down)
  window.addEventListener('keyup', up)
  window.addEventListener('blur', blur)
  return () => {
    window.removeEventListener('keydown', down)
    window.removeEventListener('keyup', up)
    window.removeEventListener('blur', blur)
  }
}
