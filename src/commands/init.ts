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
import { readdirSync, writeFileSync, mkdirSync } from 'fs'
import chalk from 'chalk'
import { createSpinner, run, parsePondVersion, storePondVersion } from '../utils'
import {
  editorConfig,
  eslintrcJs,
  defaultGitIgnore,
  defaultTsConfig,
  prettierrcJs,
} from '../templates/main'
import clear from 'clear'
import { drawHeader } from '../drawings'
import { Command } from 'commander'

export const isProjectInitialized = (): boolean => {
  const content = readdirSync('.')
  const req = ['src', 'package.json', 'tsconfig.json']
  return req.every(e => content.includes(e))
}

export const initProject = async (command: Command): Promise<void> => {
  clear()
  drawHeader()

  if (isProjectInitialized()) {
    console.log(chalk.red('Project is already initialized'))
    return
  }

  await setupGit()
  await setupNpm()
  storePondVersion(parsePondVersion(command.opts().V))
  setupTs()
  console.log(chalk`{green done}`)
}

export const checkGitProject = (): boolean => readdirSync('.').includes('.git')

export const setupGit = async (): Promise<void> => {
  if (checkGitProject()) {
    return
  }
  const spinnerDone = createSpinner('Setup git')
  await run('git init')
  spinnerDone()
}

const setupNpm = async (): Promise<void> => {
  if (readdirSync('.').includes('node_modules')) {
    return
  }

  const spinnerDone = createSpinner('Setup npm project')
  await run('npm init -y')
  writeFileSync('.gitignore', defaultGitIgnore)
  await run(
    'npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-prettier eslint-plugin-react prettier nodemon',
  )
  writeFileSync(`./.editorconfig`, editorConfig)
  writeFileSync(`./.eslintrc.js`, eslintrcJs)
  writeFileSync(`./.prettierrc.js`, prettierrcJs)
  mkdirSync('./src')
  mkdirSync('./src/fish')
  writeFileSync(`./src/fish/index.ts`, '')
  spinnerDone()
}

const setupTs = (): void => {
  if (readdirSync('.').includes('tsconfig.json')) {
    return
  }

  const spinnerDone = createSpinner('Setup TS config')
  writeFileSync('tsconfig.json', defaultTsConfig)
  spinnerDone()
}
