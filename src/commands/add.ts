import clear from 'clear'
import { drawHeader } from '../drawings'
import { Command } from 'commander'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { toKebabCase, createSpinner, run, packageInstalled, changeToProjectRoot } from '../utils'
import { isProjectInitialized, initProject } from './init'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { defaultHtml, defaultRootTsx, defaultAppTsx, axWebManifestYml } from '../templates/ui'
import {
  defaultIndexTs,
  axDockerManifestYml,
  dockerComposeAmd64,
  dockerComposeArm64v8,
  settingsSchema,
} from '../templates/node'
import { addNewFeature } from './addFeature'
import { uiPackages, uiDevPackages, nodePackages, nodeDevPackages } from '../templates/packages'

type AppNameResult = {
  appName: string
}
type ProjectInitResult = {
  confirm: boolean
}

const getAppName = async () => {
  const questions: inquirer.QuestionCollection<AppNameResult> = [
    {
      name: 'appName',
      type: 'input',
      message: 'Enter the name of your new project:',
      validate: value => {
        if (value.length) {
          return true
        } else {
          return 'Already existing. Please enter a new name'
        }
      },
    },
  ]
  return (await inquirer.prompt(questions)).appName
}

const getConfirmInitProject = async () => {
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
    await initProject()
  }

  switch (type.toUpperCase()) {
    case 'UI': {
      console.log(chalk`{whiteBright Create a new UI project with TypeScript and Parcel}`)
      const appName = toKebabCase(command.appName || (await getAppName()))
      mkdirSync(`./src/${appName}`, { recursive: true })

      if (!packageInstalled(uiPackages)) {
        const instDepSpinDone = createSpinner('Install dependencies')
        await run(`npm install ${uiPackages.join(' ')}`)
        instDepSpinDone()
      }

      if (!packageInstalled(uiDevPackages)) {
        const instDevDepSpinDone = createSpinner('Install dev dependencies')
        await run(`npm install -D ${uiDevPackages.join(' ')}`)
        instDevDepSpinDone()
      }

      const setupProjectDone = createSpinner('Create template')
      writeFileSync(`./src/${appName}/index.html`, defaultHtml)
      writeFileSync(`./src/${appName}/root.tsx`, defaultRootTsx)
      writeFileSync(`./src/${appName}/App.tsx`, defaultAppTsx)
      setupProjectDone()

      const addActyxDone = createSpinner('Add axtyx manifest')
      writeFileSync(`./src/${appName}/ax-manifest.yml`, axWebManifestYml(appName))
      writeFileSync(`./src/${appName}/settings-schema.json`, settingsSchema)
      addActyxDone()

      const addScriptsDone = createSpinner('Add project to package.json')
      const packageJson = JSON.parse(readFileSync('./package.json').toString())
      packageJson.scripts = {
        ...packageJson.scripts,
        [`ui:${appName}:start`]: `parcel src/${appName}/index.html --out-dir build/${appName}/debug`,
        [`ui:${appName}:build`]: `parcel build src/${appName}/index.html --out-dir build/${appName}/release --public-url ./`,
        [`ui:${appName}:package`]: `ax apps package src/${appName}/ax-manifest.yml`,
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
      console.log(chalk`{green done}`)
      break
    }
    case 'APP':
    case 'NODE': {
      console.log(chalk`{whiteBright Create a new NodeJS project with TypeScript}`)
      const appName = toKebabCase(command.appName || (await getAppName()))
      mkdirSync(`./src/${appName}`, { recursive: true })

      if (!packageInstalled(nodePackages)) {
        const instDepDone = createSpinner('Install dependencies')
        await run(`npm install ${nodePackages.join(' ')}`)
        instDepDone()
      }

      if (!packageInstalled(nodeDevPackages)) {
        const instDevDepDone = createSpinner('Install dev dependencies')
        await run(`npm install -D ${nodeDevPackages.join(' ')}`)
        instDevDepDone()
      }

      const setupProjectDone = createSpinner('Create template')
      writeFileSync(`./src/${appName}/index.ts`, defaultIndexTs)
      setupProjectDone()

      const addActyxDone = createSpinner('Add axtyx manifest')
      writeFileSync(`./src/${appName}/ax-manifest.yml`, axDockerManifestYml(appName))
      writeFileSync(`./src/${appName}/docker-compose-amd64.yml`, dockerComposeAmd64(appName))
      writeFileSync(`./src/${appName}/docker-compose-arm64v8.yml`, dockerComposeArm64v8(appName))
      writeFileSync(`./src/${appName}/settings-schema.json`, settingsSchema)
      addActyxDone()

      const addScriptsDone = createSpinner('Add project to package.json')
      const packageJson = JSON.parse(readFileSync('./package.json').toString())
      packageJson.scripts = {
        ...packageJson.scripts,
        [`node:${appName}:start`]: `nodemon --watch src/${appName} --exec ts-node src/${appName}/index.ts`,
        [`node:${appName}:build`]: `tsc src/${appName}/index.ts -p tsconfig.json --outDir build/${appName}`,
        [`node:${appName}:package`]: `ax apps package src/${appName}/ax-manifest.yml`,
      }
      writeFileSync('./package.json', JSON.stringify(packageJson, undefined, 2))
      addScriptsDone()

      if (command.test) {
        await addNewFeature(appName, `./src/${appName}`, 'test')
      }
      if (command.jest) {
        await addNewFeature(appName, `./src/${appName}`, 'jest')
      }
      console.log(chalk`{green done}`)
      break
    }
    default:
      console.log(chalk.red('App type not supported. Use UI ore NODE'))
      return
  }
}
