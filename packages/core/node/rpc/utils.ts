import type { DevToolsNodeContext } from '@vitejs/devtools-kit'
import { existsSync } from 'node:fs'
import process from 'node:process'
import { join } from 'pathe'
import { OxlintLogsManager } from '../oxlint/logs-manager'

const weakMap = new WeakMap<DevToolsNodeContext, OxlintLogsManager>()

export function getLogsManager(context: DevToolsNodeContext): OxlintLogsManager {
  let manager = weakMap.get(context)!
  if (!manager) {
    const dirs = [join(context.cwd, '.oxlint'), join(process.cwd(), '.oxlint')]
    const dir = dirs.find(dir => existsSync(dir))
    if (!dir) {
      console.warn(
        '[Vite DevTools Oxlint] Oxlint logs directory `.oxlint` not found, you might want to run build with `npx oxlint-inspector` to generate it first. Read more: https://github.com/yuyinws/oxlint-inspector',
      )
    }
    manager = new OxlintLogsManager(dir ?? dirs[0]!)
  }
  return manager
}

export function setLogsManager(context: DevToolsNodeContext, manager: OxlintLogsManager) {
  weakMap.set(context, manager)
}
