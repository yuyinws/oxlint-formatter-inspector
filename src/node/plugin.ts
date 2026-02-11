import type { PluginWithDevTools } from '@vitejs/devtools-kit'
import { rpcFunctions } from './rpc/index'
import { clientPublicDir } from '../dirs'

export function DevToolsOxlint(): PluginWithDevTools {
  return {
    name: 'vite:devtools:oxlint',
    devtools: {
      setup(ctx) {
        for (const fn of rpcFunctions) {
          ctx.rpc.register(fn)
        }

        ctx.views.hostStatic('/.devtools-oxlint/', clientPublicDir)

        ctx.docks.register({
          id: 'oxlint',
          title: 'Oxlint',
          icon: 'https://cdn.jsdelivr.net/gh/oxc-project/oxc-assets/round.svg',
          type: 'iframe',
          url: '/.devtools-oxlint/',
        })
      },
    },
  }
}
