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
      // @ts-expect-error - TODO: fix type error
      devtools: {
        // @ts-expect-error - TODO: fix type error
        setup(ctx) {
          for (const fn of rpcFunctions) {
            ctx.rpc.register(fn as unknown as any)
          }
        },
      },
    })

    const devtools = await DevTools()

    // @ts-expect-error - TODO: fix type error
    addVitePlugin(devtools)
  },
})
