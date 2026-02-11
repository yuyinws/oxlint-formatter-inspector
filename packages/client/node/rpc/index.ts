import type { RpcDefinitionsToFunctions } from '@vitejs/devtools-kit'
import { oxlintGetSession } from './functions/oxlint-get-session'
import { oxlintListSessions } from './functions/oxlint-list-sessions'
import '@vitejs/devtools-kit'

export const rpcFunctions = [oxlintListSessions, oxlintGetSession] as const

export type ServerFunctions = RpcDefinitionsToFunctions<typeof rpcFunctions>

// export type ServerFunctionsStatic = RpcDefinitionsToFunctions<
//   RpcDefinitionsFilter<typeof rpcFunctions, 'static'>
// >

// export type ServerFunctionsDump = {
//   [K in keyof ServerFunctionsStatic]: Awaited<ReturnType<ServerFunctionsStatic[K]>>
// }

declare module '@vitejs/devtools-kit' {
  export interface DevToolsRpcServerFunctions extends ServerFunctions {}
}
