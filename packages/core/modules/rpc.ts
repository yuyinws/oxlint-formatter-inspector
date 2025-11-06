import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import { DevTools } from '@vitejs/devtools'
import { rpcFunctions } from '../node/rpc'

export default defineNuxtModule({
  meta: {
    name: 'devtools-rpc',
    configKey: 'devtoolsRpc',
  },
  async setup() {
    addVitePlugin({
      name: 'vite:devtools-oxlint',
      devtools: {
        setup(ctx) {
          for (const fn of rpcFunctions) {
            ctx.rpc.register(fn as unknown as any)
          }
        },
      },
    })

    const devtools = await DevTools()

    addVitePlugin(devtools)
  },
})
