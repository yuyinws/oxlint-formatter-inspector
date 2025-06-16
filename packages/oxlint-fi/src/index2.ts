import { cli } from 'gunshi'
// import { version } from '../package.json'

const buildCommand = {
  name: 'build',
  description: 'build',
  run: (ctx) => {
    console.log('build')
    console.log(ctx._)
  }
}

// Create a Map of sub-commands
const subCommands = new Map()
subCommands.set('build', buildCommand)

// Define the main command
const mainCommand = {
  name: 'manage',
  description: 'Manage resources',
  run: (ctx) => {
    console.log('main')
    console.log(ctx._)
    // Main command implementation
  }
}

const customHeaderRenderer = ctx => {
  const lines = []

  // Add a fancy header
  lines.push('╔═════════════════════════════════════════╗')
  lines.push(`║       Oxlint-Formatter-Inspector        ║`)
  lines.push('╚═════════════════════════════════════════╝')

  // Add description and version
  // if (ctx.env.description) {
  //   lines.push(ctx.env.description)
  // }

  // if (ctx.env.version) {
  //   lines.push(`Version: ${ctx.env.version}`)
  // }

  lines.push('')

  // Return the header as a string
  return lines.join('\n')
}

// Run the CLI with sub-commands
await cli(process.argv.slice(2), mainCommand, {
  name: 'oxlint-formatter-inspector',
  description: 'hello world',
  version: '1.0.0',
  subCommands,
  renderHeader: customHeaderRenderer
})
