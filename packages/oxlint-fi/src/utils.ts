import { execSync } from 'node:child_process'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolve } from 'pathe'

function wrapOxlintCommand(rawArgs: string[], buildMode?: boolean) {
  if (buildMode) {
    rawArgs.shift()
  }
  const args = ['npx', 'oxlint', '-f', 'json', ...rawArgs]
  return args.join(' ')
}

export function execOxlintCommand(rawArgs: string[], buildMode?: boolean) {
  try {
    const oxlintCommand = wrapOxlintCommand(rawArgs, buildMode)
    const output = execSync(oxlintCommand, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] })
    return output
  }
  catch (error) {
    if (error instanceof Error && 'stdout' in error) {
      return error.stdout as string
    }
    throw error
  }
}

export const clientDir = resolve(dirname(fileURLToPath(import.meta.url)), './client/public')
