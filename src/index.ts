/*
 *Copyright 2020 Actyx AG
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Command } from 'commander'
import { initProject, add, addFeature, list, clean } from './commands'
import { axpVersion } from './utils'

export const cli = (): void => {
  const program = new Command()
  program.version('Actyx Project tool V:' + axpVersion)
  program
    .command('init')
    .option('-v <version>', 'Define the actyx pond version. [1, 2] (default: 2)')
    .description('Initialize axp project')
    .action(initProject)
  program
    .command('add <type>')
    .description('Add a new gui or node application to the project')
    .usage('ui|node [--appName name] [--jest]')
    .alias('a')
    .option('-n --appName <appName>', 'name for the new project (ui | node)')
    .option('--cordova', 'add a cordova template to the application (ui projects only)')
    .option('--jest', 'add jest as testing framework')
    .option('--test', 'add jest as testing framework')
    .option(
      '--storybook',
      'add Storybook for developing UI components in isolation (ui projects only)',
    )
    .action(add)
  program
    .command('addFeature <project> <feature>')
    .usage('appName test|jest|storybook|cordova')
    .description(
      'Add a new feature to an existing app in the project. (cordova|test|jest|storybook)',
    )
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

  program.parse(process.argv)
}
