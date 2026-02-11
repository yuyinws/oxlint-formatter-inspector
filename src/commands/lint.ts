import consola from 'consola'
import { define } from 'gunshi'
import { execOxlintCommand, getOxlintConfig, getOxlintVersion, groupByFilename } from '../utils'
import { mkdir, writeFile } from 'node:fs/promises'
import { cwd } from 'node:process'
import c from 'ansis'
import { version } from '../../package.json'
import { relative, resolve } from 'pathe'

export const lint = define({
  name: 'lint',
  description: 'Generate oxlint logs',
  run: async ({ _ }) => {
    consola.info(`Using Oxlint Inspector v${version}`)
    consola.start('Analyzing project...')
    const oxLintVersion = await getOxlintVersion()
    const config = await getOxlintConfig()
    const rawOutput = execOxlintCommand(_, false)
    const groupedOutput = await groupByFilename(rawOutput)

    // 生成会话（session）到 .oxlint 目录
    const logsRootDir = resolve(cwd(), '.oxlint')
    await mkdir(logsRootDir, { recursive: true })
    const sessionId = Date.now()
    const sessionDir = resolve(logsRootDir, String(sessionId))
    await mkdir(sessionDir, { recursive: true })
    await writeFile(
      resolve(sessionDir, 'meta.json'),
      JSON.stringify(
        {
          version: oxLintVersion,
          timestamp: sessionId,
          summary: groupedOutput.summary,
        },
        null,
        2,
      ),
      'utf-8',
    )
    await writeFile(
      resolve(sessionDir, 'logs.json'),
      JSON.stringify(
        {
          files: groupedOutput.files,
          config: config ? JSON.parse(config) : null,
        },
        null,
        2,
      ),
      'utf-8',
    )
    consola.success(`Session created: ${c.cyan(relative(cwd(), sessionDir))}`)
  },
})
