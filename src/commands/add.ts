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
import inquirer from 'inquirer'
import chalk from 'chalk'
import {
  toKebabCaseFileName,
  createSpinner,
  run,
  packageInstalled,
  changeToProjectRoot,
  doAppExist,
  getPondVersion,
  delay,
  createRuntimeStuff,
  createAppManifest,
} from '../utils'
import { isProjectInitialized, initProject } from './init'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import {
  defaultHtml,
  defaultRootTsx,
  defaultAppTsx,
  axWebManifestYml,
  appUiManifest,
} from '../templates/ui'
import {
  defaultIndexTs,
  axDockerManifestYml,
  dockerComposeAmd64,
  dockerComposeArm64v8,
  settingsSchema,
  dockerfile,
  packageJsonProd,
  appNodeManifest,
} from '../templates/node'
import { addNewFeature } from './addFeature'
import { uiPackages, uiDevPackages, nodePackages, nodeDevPackages } from '../templates/packages'

type AppNameResult = {
  appName: string
}
type ProjectInitResult = {
  confirm: boolean
}

const getAppName = async (): Promise<string> => {
  const questions: inquirer.QuestionCollection<AppNameResult> = [
    {
      name: 'appName',
      type: 'input',
      message: 'Enter the name of your new project:',
      validate: (value: string): boolean | string => {
        if (value.length === 0) {
          return 'Please enter a new name'
        } else if (doAppExist(value)) {
          return 'Already existing. Please enter a new name'
        } else {
          return true
        }
      },
    },
  ]
  return (await inquirer.prompt(questions)).appName
}

const getConfirmInitProject = async (): Promise<boolean> => {
  const questions: inquirer.QuestionCollection<ProjectInitResult> = [
    {
      type: 'confirm',
      name: 'confirm',
      message:
        'You are not in the root of an existing project. Do you like to initialize a new project here?',
      default: false,
    },
  ]
  return (await inquirer.prompt(questions)).confirm
}

export const add = async (type: string, command: Command): Promise<void> => {
  clear()
  drawHeader()

  changeToProjectRoot() // ignore output, isProjectInitialized will take care
  if (!isProjectInitialized()) {
    const initProjectReply = await getConfirmInitProject()
    if (!initProjectReply) {
      return
    }
    await initProject(command)
  }

  switch (type.toUpperCase()) {
    case 'UI':
      addUI(command)
      break
    case 'APP':
    case 'NODE':
      addNode(command)
      break
    default:
      console.log(chalk.red('App type not supported. Use UI ore NODE'))
      return
  }
}

const addUI = async (command: Command): Promise<void> => {
  console.log(chalk`{whiteBright Create a new UI project with TypeScript and Parcel}`)
  const appName = toKebabCaseFileName(command.appName || (await getAppName()))

  if (doAppExist(appName)) {
    console.log(chalk`{red ${appName}} already exists. Please use another name`)
    return
  }

  mkdirSync(`./src/${appName}`, { recursive: true })
  const pondVersion = getPondVersion()

  const setupProjectDone = createSpinner('Create template')
  writeFileSync(`./src/${appName}/index.html`, defaultHtml(appName))
  writeFileSync(`./src/${appName}/root.tsx`, defaultRootTsx(pondVersion))
  writeFileSync(`./src/${appName}/App.tsx`, defaultAppTsx)
  setupProjectDone()

  if (createRuntimeStuff(pondVersion)) {
    const addActyxDone = createSpinner('Add Actyx manifest')
    writeFileSync(`./src/${appName}/ax-manifest.yml`, axWebManifestYml(appName))
    writeFileSync(`./src/${appName}/settings-schema.json`, settingsSchema)
    addActyxDone()
  }

  if (!packageInstalled(uiPackages(pondVersion))) {
    const instDepSpinDone = createSpinner('Install dependencies')
    await run(`npm install ${uiPackages(pondVersion).join(' ')}`)
    instDepSpinDone()
  }

  if (!packageInstalled(uiDevPackages)) {
    const instDevDepSpinDone = createSpinner('Install dev dependencies')
    await run(`npm install -D ${uiDevPackages.join(' ')}`)
    instDevDepSpinDone()
  }

  const addScriptsDone = createSpinner('Add project to package.json')
  const packageJson = JSON.parse(readFileSync('./package.json').toString())
  packageJson.scripts = {
    ...packageJson.scripts,
    [`ui:${appName}:start`]: `parcel src/${appName}/index.html --out-dir build/${appName}/debug`,
    [`ui:${appName}:build`]: `parcel build src/${appName}/index.html --out-dir src/${appName}/release --public-url ./`,
  }
  if (createRuntimeStuff(pondVersion)) {
    packageJson.scripts = {
      ...packageJson.scripts,
      [`ui:${appName}:package`]: `ax apps package src/${appName}/ax-manifest.yml`,
    }
  }
  if (createAppManifest(pondVersion)) {
    const addManifestDone = createSpinner('Add Actyx app manifest')
    writeFileSync(`./src/${appName}/manifest.ts`, appUiManifest(appName))
    addManifestDone()
  }
  writeFileSync('./package.json', JSON.stringify(packageJson, undefined, 2))
  addScriptsDone()

  if (command.test) {
    await addNewFeature(appName, `./src/${appName}`, 'test')
  }
  if (command.jest) {
    await addNewFeature(appName, `./src/${appName}`, 'jest')
  }
  if (command.storybook) {
    await addNewFeature(appName, `./src/${appName}`, 'storybook')
  }
  if (command.cordova) {
    await addNewFeature(appName, `./src/${appName}`, 'cordova')
  }
  console.log(chalk`{green done}`)
}

const addNode = async (command: Command): Promise<void> => {
  console.log(chalk`{whiteBright Create a new NodeJS project with TypeScript}`)
  const appName = toKebabCaseFileName(command.appName || (await getAppName()))
  mkdirSync(`./src/${appName}`, { recursive: true })

  const pondVersion = getPondVersion()

  const setupProjectDone = createSpinner('Create template')
  writeFileSync(`./src/${appName}/index.ts`, defaultIndexTs(pondVersion))
  setupProjectDone()

  if (createRuntimeStuff(pondVersion)) {
    const addActyxDone = createSpinner('Add Actyx manifest')
    writeFileSync(`./src/${appName}/Dockerfile`, dockerfile(appName))
    writeFileSync(`./src/${appName}/ax-manifest.yml`, axDockerManifestYml(appName))
    writeFileSync(`./src/${appName}/docker-compose-amd64.yml`, dockerComposeAmd64(appName))
    writeFileSync(`./src/${appName}/docker-compose-arm64v8.yml`, dockerComposeArm64v8(appName))
    writeFileSync(`./src/${appName}/settings-schema.json`, settingsSchema)
    writeFileSync(`./src/${appName}/package-prod.json`, packageJsonProd(appName, pondVersion))
    addActyxDone()
  }
  if (createAppManifest(pondVersion)) {
    const addManifestDone = createSpinner('Add Actyx app manifest')
    writeFileSync(`./src/${appName}/manifest.ts`, appNodeManifest(appName))
    addManifestDone()
  }

  if (!packageInstalled(nodePackages(pondVersion))) {
    const instDepDone = createSpinner('Install dependencies')
    await run(`npm install ${nodePackages(pondVersion).join(' ')}`)
    instDepDone()
  }

  if (!packageInstalled(nodeDevPackages)) {
    const instDevDepDone = createSpinner('Install dev dependencies')
    await run(`npm install -D ${nodeDevPackages.join(' ')}`)
    instDevDepDone()
  }
  await delay(100)

  const addScriptsDone = createSpinner('Add project to package.json')
  const packageJson = JSON.parse(readFileSync('./package.json').toString())
  packageJson.scripts = {
    ...packageJson.scripts,
    [`node:${appName}:start`]: `nodemon --watch src/${appName} --exec ts-node src/${appName}/index.ts`,
    [`node:${appName}:build`]: `tsc src/${appName}/index.ts --outDir build/${appName} --esModuleInterop --skipLibCheck`,
  }
  if (createRuntimeStuff(pondVersion)) {
    packageJson.scripts = {
      ...packageJson.scripts,
      [`node:${appName}:docker:build`]: `npm run node:${appName}:build && docker build -t ${appName} -f src/${appName}/Dockerfile .`,
      [`node:${appName}:docker:build-aarch64`]: `npm run node:${appName}:build && docker buildx build --platform linux/arm64 -t ${appName}-aarch64 -f src/${appName}/Dockerfile --load .`,
      [`node:${appName}:package`]: `ax apps package src/${appName}/ax-manifest.yml`,
    }
  }
  writeFileSync('./package.json', JSON.stringify(packageJson, undefined, 2))
  addScriptsDone()

  if (command.test) {
    await addNewFeature(appName, `./src/${appName}`, 'test')
  }
  if (command.jest) {
    await addNewFeature(appName, `./src/${appName}`, 'jest')
  }
  if (command.docker) {
    await addNewFeature(appName, `./src/${appName}`, 'docker')
  }
  console.log(chalk`{green done}`)
}
