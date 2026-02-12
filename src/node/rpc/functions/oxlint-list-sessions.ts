import { defineRpcFunction } from '@vitejs/devtools-kit'
import { getLogsManager } from '../utils'

export const oxlintListSessions = defineRpcFunction({
  name: 'oxc-inspector:list-lint-session',
  type: 'query',
  setup: context => {
    return {
      handler: async () => {
        const logsManager = getLogsManager(context)
        const sessions = await logsManager.list()
        return sessions
      },
    }
  },
})
