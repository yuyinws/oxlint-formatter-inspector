<img src="https://cdn.jsdelivr.net/gh/yuyinws/static@master/2025/11/upgit_20251107_1762507194.png" ><br>

<p align="center">Visualize The Oxlint.</p>

https://github.com/user-attachments/assets/c9cd8648-8d3c-40de-a3d9-00cfed3dd39a

> [!WARNING]
> This is an experimental PoC project. It's not ready for production use yet.

## Features

- ⚡️ Integration with [Vite DevTools](https://github.com/vitejs/devtools)
- 🔍 Glob patterns search support
- 🌈 Code highlight
- 🚀 Launch Editor support

## Integration with Vite DevTools

1. Generate Oxlint logs (No need for this step if Oxlint can built-in it. trace on [oxc#15573](https://github.com/oxc-project/oxc/issues/15573))

```bash
npx oxlint-inspector
```

> Make sure oxlint is installed first. This command will generate a `.oxlint` directory in the current process directory, which includes the Oxlint logs.

2. Install Plugin

```bash
npm i vite-plugin-devtools-oxlint -D
```

3. Configure Vite

```ts
import { DevTools } from '@vitejs/devtools'
import { defineConfig } from 'vite'
import { DevToolsOxlint } from 'vite-plugin-devtools-oxlint'

export default defineConfig({
  plugins: [
    DevTools(),
    DevToolsOxlint(),
  ],
})
```

## License

[MIT](./LICENSE) License © 2025-PRESENT [Leo](https://github.com/yuyinws)
