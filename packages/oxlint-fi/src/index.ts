import { readFile, stat } from 'node:fs/promises'
import { argv } from 'node:process'
import c from 'ansis'
import consola from 'consola'
import { getPort } from 'get-port-please'
import { cli, define } from 'gunshi'
import { getQuery, H3, serve, serveStatic } from 'h3'
import { lookup } from 'mrmime'
import { join } from 'pathe'
import { clientDir, execOxlintCommand } from './utils'

const mainCommand = define({
  name: 'main',
  run: async ({ _ }) => {
    const output = execOxlintCommand(_, false)
    const app = new H3()

    app.use('/api/payload.json', () => {
      return output
    })

    app.use('/**', (event) => {
      return serveStatic(event, {
        indexNames: ['/index.html'],
        getContents: id => readFile(join(clientDir, id)),
        getMeta: async (id) => {
          const stats = await stat(join(clientDir, id)).catch(() => {})
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

    consola.info(`Starting Oxlint formatter inspector at`, c.green`http://localhost:${port}`, '\n')
  },
})

const buildCommand = define({
  name: 'build',
  run: ({ _ }) => {
    const output = execOxlintCommand(_, true)
    console.log(output)
  },
})

cli(argv.slice(2), mainCommand, {
  name: 'oxlint-formatter-inspector',
  description: 'hello world',
  version: '1.0.0',
  subCommands: new Map([
    ['build', buildCommand],
  ]),
})
