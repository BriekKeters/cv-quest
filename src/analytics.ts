// Custom events for GoatCounter, loaded from index.html. It sets no cookies
// and stores nothing on the visitor's device, so no consent banner is needed.
// Every call is a safe no-op while the script loads, when it is blocked by an
// ad blocker, and on localhost (which GoatCounter ignores).

declare global {
  interface Window {
    goatcounter?: {
      count?: (vars: { path: string; title?: string; event?: boolean }) => void
    }
  }
}

export function track(name: string) {
  window.goatcounter?.count?.({ path: name, title: name, event: true })
}

export function trackProject(projectName: string) {
  const slug = projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  track(`project-${slug}`)
}
