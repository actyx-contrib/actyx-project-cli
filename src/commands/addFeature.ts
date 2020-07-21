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
import chalk from 'chalk'
import {
  createSpinner,
  run,
  toKebabCaseFileName,
  packageInstalled,
  changeToProjectRoot,
} from '../utils'
import { existsSync, writeFileSync, readFileSync, mkdirSync } from 'fs'
import clear from 'clear'
import { drawHeader } from '../drawings'
import { jestExample, jestConfigJs } from '../templates/main/jest'
import { jestDevPackages, storybookDevPackages } from '../templates/packages'
import {
  storybookMain,
  storybookPreview,
  storybookWebpack,
  storybookAppStory,
} from '../templates/ui/storybook'

export const addFeature = async (
  project: string,
  feature: string,
  _command: Command,
): Promise<void> => {
  clear()
  drawHeader()
  if (!changeToProjectRoot()) {
    console.log(chalk`{red project is not initialized}`)
    return
  }

  const projectPath = `./src/${toKebabCaseFileName(project)}`
  if (!existsSync(projectPath)) {
    console.log(
      chalk`{red Project ${projectPath} do not exist.} {white Use} {yellow axp list} {white to get all existing projects}`,
    )
    return
  }

  addNewFeature(project, `./src/${project}`, feature)
}

export const addNewFeature = async (
  appName: string,
  projectPath: string,
  feature: string,
): Promise<void> => {
  switch (feature.toLowerCase()) {
    case 'test':
    case 'jest':
      addJest(appName, projectPath)
      break
    case 'storybook': {
      addStorybook(appName)
      break
    }
    default:
      console.log(chalk`{red Feature ${feature} is not supported}`)
      return
  }
}

const addJest = async (appName: string, projectPath: string): Promise<void> => {
  const scripts = JSON.parse(readFileSync('./package.json').toString()).scripts
  const startScript = Object.keys(scripts).find(k => k.includes(`:${appName}:start`))
  if (!startScript) {
    console.log(chalk`{red App ${appName} do not exist in Package.json.}`)
    return
  }
  const [projectType] = startScript.split(':')

  if (!packageInstalled(jestDevPackages)) {
    const addJestDone = createSpinner('add jest as test framework')
    await run(`npm install -D ${jestDevPackages.join(' ')}`)
    addJestDone()
  }

  const createExampleDone = createSpinner('setup jest config and example')
  if (!existsSync('./jest.config.js')) {
    writeFileSync('./jest.config.js', jestConfigJs)
  }
  writeFileSync(`${projectPath}/index.spec.ts`, jestExample(appName))
  createExampleDone()

  const addScriptsDone = createSpinner('Add jest to package.json')

  const packageJson = JSON.parse(readFileSync('./package.json').toString())
  packageJson.scripts = {
    ...packageJson.scripts,
    [`${projectType}:${appName}:test`]: `TZ=UTC jest  --collectCoverageFrom="['!src/**/*.stories.tsx', './src/${appName}/**/*.{ts,tsx}', '!**/*.d.ts']" --coverageDirectory="<rootDir>/coverage/${appName}" ./src/${appName}`,
    [`${projectType}:${appName}:test:noCoverage`]: `TZ=UTC jest --coverage=false ./src/${appName}`,
    [`${projectType}:${appName}:test:watch`]: `TZ=UTC jest --coverage=false --watch ./src/${appName}`,
  }
  writeFileSync('./package.json', JSON.stringify(packageJson, undefined, 2))
  addScriptsDone()
}

const addStorybook = async (appName: string): Promise<void> => {
  const scripts = JSON.parse(readFileSync('./package.json').toString()).scripts
  const startScript = Object.keys(scripts).find(k => k.includes(`:${appName}:start`))
  if (!startScript) {
    console.log(chalk`{red App ${appName} do not exist in Package.json.}`)
    return
  }
  const [projectType] = startScript.split(':')
  if (projectType !== 'ui') {
    console.log(
      chalk`{red App ${appName} cannot add Storybook, it can be added only to a UI project.}`,
    )
    return
  }

  if (!packageInstalled(storybookDevPackages)) {
    const addStorybookDone = createSpinner('Add Storybook')
    await run(`npm install -D ${storybookDevPackages.join(' ')}`)
    addStorybookDone()
  }

  const createExampleDone = createSpinner('Setup storybook config and example')

  if (!existsSync('.storybook')) {
    mkdirSync('.storybook', { recursive: true })
    if (!existsSync('.storybook/main.js')) {
      writeFileSync('.storybook/main.js', storybookMain)
    }
    if (!existsSync('.storybook/preview.js')) {
      writeFileSync('.storybook/preview.js', storybookPreview)
    }
    if (!existsSync('.storybook/webpack.config.js')) {
      writeFileSync('.storybook/webpack.config.js', storybookWebpack)
    }
  }

  if (existsSync(`src/${appName}/App.tsx`) && !existsSync(`src/${appName}/App.stories.tsx`)) {
    writeFileSync(`src/${appName}/App.stories.tsx`, storybookAppStory(appName))
  }

  const packageJson = JSON.parse(readFileSync('./package.json').toString())
  packageJson.scripts = {
    ...packageJson.scripts,
    storybook: 'start-storybook -p 6006',
  }
  writeFileSync('./package.json', JSON.stringify(packageJson, undefined, 2))
  createExampleDone()
}
