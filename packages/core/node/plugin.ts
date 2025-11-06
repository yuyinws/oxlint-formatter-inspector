import type { PluginWithDevTools } from '@vitejs/devtools-kit'
import { clientPublicDir } from '../dirs'
import { rpcFunctions } from './rpc/index'

export function DevToolsOxlint(): PluginWithDevTools {
  return {
    name: 'vite:devtools:oxlint',
    devtools: {
      setup(ctx) {
        // eslint-disable-next-line no-console
        console.log('Vite DevTools Oxlint plugin setup')

        for (const fn of rpcFunctions) {
          ctx.rpc.register(fn)
        }

        ctx.views.hostStatic(
          '/.devtools-oxlint/',
          clientPublicDir,
        )

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
