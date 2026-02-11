import { argv } from 'node:process'
import { cli } from 'gunshi'
import { version } from '../package.json'
import { mainCommand } from './commands/main'
import { lint } from './commands/lint'

cli(argv.slice(2), mainCommand, {
  name: 'oxc-inspector',
  version,
  renderHeader: () => Promise.resolve(''),
  subCommands: {
    lint,
  },
})
