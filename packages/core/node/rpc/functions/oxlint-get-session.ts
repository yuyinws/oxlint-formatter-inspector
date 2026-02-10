import { defineRpcFunction } from '@vitejs/devtools-kit'
import { getLogsManager } from '../utils'

export const oxlintGetSession = defineRpcFunction({
  name: 'vite:oxlint:get-session',
  type: 'query',
  setup: context => {
    return {
      handler: async ({ sessionId }: { sessionId: string }) => {
        const logsManager = getLogsManager(context)
        const session = await logsManager.loadSession(sessionId)
        return session
      },
    }
  },
})
