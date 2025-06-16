<img src="https://eslint-formatter-inspector.vercel.app/favicon.svg" width="100" height="100"><br>

# Oxlint Formatter Inspector

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

![demo](https://static.yuy1n.io/eslint-formatter-inspector-demo.png)

<p align='center'>
An interactive tool for inspecting ESLint formatter in the browser.
</p>

<p align='center'>
  <a target='_blank' href='https://eslint-formatter-inspector.vercel.app/'>
    Live Demo
  </a>
</p>

## Features

- 🖥️ Terminal-style UI.
- 🌓 Multi-theme switch.
- 📦 Static Build.
- 🌈 Code highlight.
- 🚀 Launch Editor support.
- 🔍 Glob patterns search support.

## Installation

```bash
npm i eslint-formatter-i -D
```

## Usage

```bash
eslint [patterns] -f i
```

> -f is short for --format
> See [ESLint Formatters](https://eslint.org/docs/latest/use/formatters/#eslint-formatters) for more details

### Static Build

If you want to build a static web app for ESLint Formatter, you can set the environment variable `INSPECTOR_MODE=build`:

```bash
INSPECTOR_MODE=build eslint [patterns] -f i
```

> This will generate a SPA under `.eslint-formatter-inspector` folder. You can deploy it to any static file server.

## License

[MIT](./LICENSE) License © 2025-PRESENT [Leo](https://github.com/yuyinws)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/eslint-formatter-i?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/eslint-formatter-i
[npm-downloads-src]: https://img.shields.io/npm/dm/eslint-formatter-i?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/eslint-formatter-i
[license-src]: https://img.shields.io/github/license/yuyinws/eslint-formatter-inspector.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/yuyinws/eslint-formatter-inspector/blob/main/LICENSE

## Credits

- [webtui](https://webtui.ironclad.sh/)

- [eslint-formatter-mo](https://github.com/fengzilong/eslint-formatter-mo)

- [eslint-config-inspector](https://github.com/eslint/config-inspector)
