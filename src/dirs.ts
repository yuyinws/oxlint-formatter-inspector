import { fileURLToPath } from 'node:url'

export const clientPublicDir: string = fileURLToPath(new URL('./client/public', import.meta.url))
