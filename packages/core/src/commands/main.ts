import { define } from 'gunshi'
import { H3, serve, serveStatic } from 'h3'
import { readFile, stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRpcServer } from '@vitejs/devtools-rpc/server'
import { createWsRpcPreset } from '@vitejs/devtools-rpc/presets/ws/server'
import { clientRpc } from '../../../client/node/collector'

// const serverFunctions = {
//   hello: (no: number) => {
//     console.log('hello world from client', no)
//   },
// }

createRpcServer(clientRpc.functions, {
  preset: createWsRpcPreset({
    port: 5556,
  }),
})

export const mainCommand = define({
  name: 'main',
  description: 'Start oxc-inspector ui',
  run: async ({ _ }) => {
    const app = new H3()
    const clientDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../dist/client/public')

    const basePath = '/.devtools-oxlint'
    const toFilePath = (id: string) => {
      const path = id.startsWith(basePath) ? id.slice(basePath.length) || '/' : id
      return path === '/' ? 'index.html' : path.replace(/^\//, '')
    }
    app.use('/.devtools-oxlint/**', event => {
      return serveStatic(event, {
        indexNames: ['index.html'],
        getContents: id => readFile(join(clientDir, toFilePath(id))),
        getMeta: async id => {
          const stats = await stat(join(clientDir, toFilePath(id))).catch(() => {})
          return stats?.isFile() ? { size: stats.size, mtime: stats.mtimeMs } : undefined
        },
        fallthrough: true,
      })
    })

    serve(app, { port: 5555 })
  },
})
