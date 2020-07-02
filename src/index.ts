import clear from 'clear'
import { drawHeader } from './drawings'
import { Command } from 'commander'
import { add } from './commands/add'
import { initProject } from './commands/init'
import { list } from './commands/list'
import { clean } from './commands/clean'
import { addFeature } from './commands/addFeature'

export const cli = () => {
  const program = new Command();
  program.version(require('../package.json').version)
  program.option('--init', 'Initialize new project')
  program
    .command('init')
    .description('Initialize axp project')
    .action(initProject)
  program
    .command('add <type>')
    .description('Add a new gui or node application to the project')
    .usage('ui|node [--appName name] [--jest]')
    .alias('a')
    .option('-n --appName <appName>', 'name for the new project')
    .option('--jest', 'add jest as testing framework')
    .option('--storybook', 'add Storybook for developing UI components in isolation')
    .action(add)
  program
    .command('addFeature <project> <feature>')
    .usage('name test|jest')
    .description('Add a new feature to an existing app in the project. (test|jest)')
    .alias('af')
    .action(addFeature)
  program
    .command('list')
    .description('List all existing applications')
    .alias('ls')
    .action(list)
  program
    .command('clean')
    .description('Remove all unreferenced applications from the package.json')
    .action(clean)

  program.parse(process.argv)
}

export const main = () => {
  clear()
  drawHeader()
}

