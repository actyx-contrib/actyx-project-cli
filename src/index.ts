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
    .description('add a new UI or node application to the project')
    .alias('a')
    .option('-n --appName <appName>', 'name for the new project')
    .action(add)
  program
    .command('addFeature <project> <feature>')
    .description('add a new feature to an existing app in the project')
    .alias('af')
    .action(addFeature)
  program
    .command('list')
    .description('list all existing applications')
    .alias('ls')
    .action(list)
  program
    .command('clean')
    .description('clean all unreferenced applications from the package.json')
    .action(clean)

  program.parse(process.argv)
}

export const main = () => {
  clear()
  drawHeader()
}
add

