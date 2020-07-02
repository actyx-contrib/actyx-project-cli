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
import clear from 'clear'
import { drawHeader } from '../drawings'
import { Command } from 'commander'
import chalk from 'chalk'
import inquirer from 'inquirer'
import Table from 'cli-table3'
import { getProjects } from './list'
import { readFileSync, writeFileSync } from 'fs'
import { changeToProjectRoot } from '../utils'

export const clean = async (_command: Command): Promise<void> => {
  clear()
  drawHeader()
  if (!changeToProjectRoot()) {
    console.log(chalk`{red project is not initialized}`)
    return
  }

  const { unRefProjects } = getProjects()

  if (unRefProjects.length === 0) {
    console.log(chalk`{green Nothing to clean up}`)
    return
  }
  if (unRefProjects.length === 1) {
    console.log(chalk`{yellow You have a unlinked project}`)
  } else if (unRefProjects.length > 1) {
    console.log(chalk`{yellow You have ${unRefProjects.length} unlinked projects}`)
  }

  if (unRefProjects.length > 0) {
    const unRefTable = new Table()
    unRefTable.push(...unRefProjects.map(e => [e.type, e.name]))
    console.log(unRefTable.toString())
  }

  const confirm = await getConfirm()
  if (!confirm) {
    console.log(chalk`{redBright canceled}`)
  }

  const packageJson = JSON.parse(readFileSync('./package.json').toString())
  packageJson.scripts = unRefProjects.reduce((acc, appName) => {
    delete acc[`${appName.type}:${appName.name}:start`]
    delete acc[`${appName.type}:${appName.name}:build`]
    return acc
  }, packageJson.scripts)

  writeFileSync('./package.json', JSON.stringify(packageJson, undefined, 2))
  console.log(chalk`{green done}`)
}

type AppNameResult = {
  cleanupConfirm: boolean
}

const getConfirm = async () => {
  const questions: inquirer.QuestionCollection<AppNameResult> = [
    {
      type: 'confirm',
      name: 'cleanupConfirm',
      message: 'Do you like to execute the clean up?',
      default: false,
    },
  ]
  return (await inquirer.prompt(questions)).cleanupConfirm
}
