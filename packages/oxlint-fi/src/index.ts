import { existsSync } from 'node:fs'
import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { argv, cwd } from 'node:process'
import c from 'ansis'
import consola from 'consola'
import { getPort } from 'get-port-please'
import { cli, define } from 'gunshi'
import { getQuery, H3, serve, serveStatic } from 'h3'
import launch from 'launch-editor'
import { lookup } from 'mrmime'
import open from 'open'
import { join, relative, resolve } from 'pathe'
import { version } from '../package.json'
import { clientDir, execOxlintCommand, getOxlintConfig, getOxlintVersion, groupByFilename } from './utils'

const mainCommand = define({
  name: 'main',
  run: async ({ _ }) => {
    consola.info(`Using Oxlint Formatter Inspector v${version}`)
    consola.start('Analyzing project...')
    const oxLintVersion = await getOxlintVersion()
    const config = await getOxlintConfig()
    const rawOutput = execOxlintCommand(_, false)
    const groupedOutput = await groupByFilename(rawOutput)
    const app = new H3()

    app.use('/api/payload.json', () => {
      return {
        version: oxLintVersion,
        config: config ? JSON.parse(config) : null,
        timestamp: Date.now(),
        ...groupedOutput,
      }
    })

    app.use('/api/launch', async (event) => {
      try {
        const query = getQuery(event)
        if (query.file) {
          const absolutePath = join(cwd(), query.file)
          launch(absolutePath)
          return {
            status: 'success',
          }
        }
      }
      catch (error) {
        return {
          status: 'error',
          error: String(error),
        }
      }
    })

    app.use('/**', (event) => {
      return serveStatic(event, {
        indexNames: ['/index.html'],
        getContents: id => readFile(join(clientDir, id)),
        getMeta: async (id) => {
          const stats = await stat(join(clientDir, id)).catch(() => { })
          if (stats?.isFile()) {
            return {
              size: stats.size,
              mtime: stats.mtimeMs,
              type: lookup(id),
            }
          }
        },
        fallthrough: true,
      })
    })

    const port = await getPort({ port: 3778, portRange: [3778, 4000] })

    serve(app, { port, silent: true })

    consola.success(`Starting at`, c.green`http://localhost:${port}`, '\n')
    open(`http://localhost:${port}`)
  },
})

const buildCommand = define({
  name: 'build',
  run: async ({ _ }) => {
    consola.info(`Using Oxlint Formatter Inspector v${version}`)
    consola.start('Building project...')

    const oxLintVersion = await getOxlintVersion()
    const config = await getOxlintConfig()
    const rawOutput = execOxlintCommand(_, true)
    console.log({
      rawOutput,
    })
    const groupedOutput = await groupByFilename(rawOutput)

    const outputDir = resolve(cwd(), '.oxlint-formatter-inspector')
    if (existsSync(outputDir)) {
      await rm(outputDir, { recursive: true })
    }
    await mkdir(outputDir, { recursive: true })
    await cp(clientDir, outputDir, { recursive: true })
    await mkdir(resolve(outputDir, 'api'), { recursive: true })
    await writeFile(resolve(outputDir, 'api', 'payload.json'), JSON.stringify({
      version: oxLintVersion,
      config: config ? JSON.parse(config) : null,
      timestamp: Date.now(),
      ...groupedOutput,
    }, null, 2), 'utf-8')

    consola.success(`Built to ${c.cyan(relative(cwd(), outputDir))}`)
    consola.success(`You can preview this build using ${c.green`npx serve ${relative(cwd(), outputDir)}`}`)
  },
})

cli(argv.slice(2), mainCommand, {
  name: 'oxlint-formatter-inspector',
  version,
  renderHeader: () => Promise.resolve(''),
  subCommands: new Map([
    ['build', buildCommand],
  ]),
})
