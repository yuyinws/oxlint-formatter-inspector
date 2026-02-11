import { define } from 'gunshi'
import { H3, serve, serveStatic } from 'h3'
import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { createRpcServer } from '@vitejs/devtools-rpc/server'
import { createWsRpcPreset } from '@vitejs/devtools-rpc/presets/ws/server'
import { clientRpc } from '../node/collector'
import { clientPublicDir } from '../dirs'

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

    const basePath = '/.oxc-inspector'
    const toFilePath = (id: string) => {
      const path = id.startsWith(basePath) ? id.slice(basePath.length) || '/' : id
      return path === '/' ? 'index.html' : path.replace(/^\//, '')
    }
    app.use('/.oxc-inspector/**', event => {
      if (event.url.pathname.includes('.devtools.vdt-connection.json')) {
        return {
          backend: 'h3',
          port: 5556,
        }
      }

      return serveStatic(event, {
        indexNames: ['index.html'],
        getContents: id => readFile(join(clientPublicDir, toFilePath(id))),
        getMeta: async id => {
          const stats = await stat(join(clientPublicDir, toFilePath(id))).catch(() => {})
          return stats?.isFile() ? { size: stats.size, mtime: stats.mtimeMs } : undefined
        },
        fallthrough: true,
      })
    })

    serve(app, { port: 5555 })
  },
})
