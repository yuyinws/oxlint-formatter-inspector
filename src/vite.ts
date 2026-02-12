import type { PluginWithDevTools } from '@vitejs/devtools-kit'
import { rpcFunctions } from './node/rpc'
import { clientPublicDir } from './dirs'

export function DevToolsOxlint(): PluginWithDevTools {
  return {
    name: 'oxc-inspector',
    devtools: {
      setup(ctx) {
        for (const fn of rpcFunctions) {
          ctx.rpc.register(fn)
        }

        ctx.views.hostStatic('/.oxc-inspector/', clientPublicDir)

        ctx.docks.register({
          id: 'oxc',
          title: 'Oxc Inspector',
          icon: 'https://viteplus.dev/projects/oxc.svg',
          type: 'iframe',
          url: '/.oxc-inspector/',
        })
      },
    },
  }
}
