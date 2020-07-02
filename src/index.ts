import { Command } from 'commander'
import { initProject, add, addFeature, list, clean, addFish } from './commands'

export const cli = (): void => {
  const program = new Command()
  // eslint-disable-next-line @typescript-eslint/no-var-requires
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
    .option('--test', 'add jest as testing framework')
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
    .alias('c')
    .action(clean)
  program
    .command('addFish <fishName>')
    .description('create a new fish in the src/fish folder')
    .alias('fish')
    .option('--registry', 'add a createRegistry to the fish definition')
    .option(
      '--noExample',
      'skip example onEvent and onCommand to build it with the VSCode plugin or write it your self',
    )
    .option('--noSnapshot', 'remove the snapshot template in the fish definition')
    .action(addFish)

  program.parse(process.argv)
}
