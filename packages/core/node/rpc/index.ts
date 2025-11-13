import { oxlintGetSession } from './functions/oxlint-get-session'
import { oxlintListSessions } from './functions/oxlint-list-sessions'

export const rpcFunctions = [
  oxlintListSessions,
  oxlintGetSession,
] as const
