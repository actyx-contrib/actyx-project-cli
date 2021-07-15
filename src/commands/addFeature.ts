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
  writeFileSyncIfNotExists,
  writeFileInPathSyncIfNotExists,
  getPondVersion,
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
import {
  cordovaBuildScripts,
  cordovaConfigXml,
  cordovaGitIgnore,
  cordovaPackageJson,
} from '../templates/ui/cordova'
import { dockerfile, packageJsonProd } from '../templates/node'
import { join } from 'path'

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

  const projectPath = join('.', 'src', toKebabCaseFileName(project))
  if (!existsSync(projectPath)) {
    console.log(
      chalk`{red Project ${projectPath} doesn't exist.} {white Use} {yellow axp list} {white to get all existing projects}`,
    )
    return
  }

  addNewFeature(project, join('.', 'src', project), feature)
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
    case 'cordova': {
      addCordova(appName, projectPath)
      break
    }
    case 'docker': {
      addDocker(appName, projectPath)
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
    console.log(chalk`{red App ${appName} doesn't exist in package.json.}`)
    return
  }
  const [projectType] = startScript.split(':')

  if (!packageInstalled(jestDevPackages)) {
    const addJestDone = createSpinner('add jest as test framework')
    await run(`npm install -D ${jestDevPackages.join(' ')}`)
    addJestDone()
  }

  const createExampleDone = createSpinner('setup jest config and example')
  writeFileSyncIfNotExists('./jest.config.js', jestConfigJs)
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
    console.log(chalk`{red App ${appName} doesn't exist in package.json.}`)
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
    writeFileSyncIfNotExists('.storybook/main.js', storybookMain)
    writeFileSyncIfNotExists('.storybook/preview.js', storybookPreview)
    writeFileSyncIfNotExists('.storybook/webpack.config.js', storybookWebpack)
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

const addCordova = async (appName: string, projectPath: string): Promise<void> => {
  const scripts = JSON.parse(readFileSync('./package.json').toString()).scripts
  const startScript = Object.keys(scripts).find(k => k.includes(`:${appName}:start`))
  if (!startScript) {
    console.log(chalk`{red App ${appName} doesn't exist in package.json.}`)
    return
  }
  const [projectType] = startScript.split(':')
  if (projectType !== 'ui') {
    console.log(
      chalk`{red App ${appName} cannot add Cordova, it can be added only to a UI project.}`,
    )
    return
  }
  const pondVersion = getPondVersion()

  const createExampleDone = createSpinner('Setup cordova template')

  const cordovaDir = `${projectPath}/cordova`
  if (!existsSync(cordovaDir)) {
    mkdirSync(cordovaDir, { recursive: true })

    writeFileSyncIfNotExists(`${cordovaDir}/package.json`, cordovaPackageJson(appName))
    writeFileSyncIfNotExists(`${cordovaDir}/config.xml`, cordovaConfigXml(appName))
    writeFileSyncIfNotExists(`${cordovaDir}/.gitignore`, cordovaGitIgnore)
    writeFileInPathSyncIfNotExists(
      `${cordovaDir}/scripts`,
      'buildApp.js',
      cordovaBuildScripts(appName, pondVersion),
    )
    writeFileInPathSyncIfNotExists(`${cordovaDir}/www`, 'gitkeep', '')
  }

  const packageJson = JSON.parse(readFileSync('./package.json').toString())
  packageJson.scripts = {
    ...packageJson.scripts,
    storybook: 'start-storybook -p 6006',
  }
  writeFileSync('./package.json', JSON.stringify(packageJson, undefined, 2))
  createExampleDone()
}

const addDocker = async (appName: string, projectPath: string): Promise<void> => {
  const scripts = JSON.parse(readFileSync('./package.json').toString()).scripts
  const startScript = Object.keys(scripts).find(k => k.includes(`:${appName}:start`))
  if (!startScript) {
    console.log(chalk`{red App ${appName} doesn't exist in package.json.}`)
    return
  }

  const pondVersion = getPondVersion()
  const [projectType] = startScript.split(':')
  if (projectType !== 'node') {
    console.log(
      chalk`{red App ${appName} - ${projectType} can't add Docker. Docker can be added to a node project only.}`,
    )
    return
  }

  const addDockerDone = createSpinner('add docker files')
  writeFileSyncIfNotExists(`${projectPath}/Dockerfile`, dockerfile(appName))
  writeFileSyncIfNotExists(
    `${projectPath}/package-prod.json`,
    packageJsonProd(appName, pondVersion),
  )
  addDockerDone()

  const addScriptsDone = createSpinner('Add docker:build to package.json')
  const packageJson = JSON.parse(readFileSync('./package.json').toString())
  packageJson.scripts = {
    ...packageJson.scripts,
    [`node:${appName}:docker:build`]: `npm run node:${appName}:build && docker build -t ${appName} -f src/${appName}/Dockerfile .`,
    [`node:${appName}:docker:build-aarch64`]: `npm run node:${appName}:build && docker buildx build --platform linux/arm64 -t ${appName}-aarch64 -f src/${appName}/Dockerfile --load .`,
  }
  writeFileSync('./package.json', JSON.stringify(packageJson, undefined, 2))
  addScriptsDone()
}
