import clear from 'clear'
import { drawHeader } from '../drawings'
import { Command } from 'commander'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { toKebabCase, createSpinner, run } from '../utils'
import { isProjectInitialized, initProject } from './init'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { defaultHtml, defaultRootTsx, defaultAppTsx } from '../templates/ui'
import { defaultIndexTs } from '../templates/node'

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
      }
    }
  ]
  return (await inquirer.prompt(questions)).appName
}


const getConfirmInitProject = async () => {
  const questions: inquirer.QuestionCollection<ProjectInitResult> = [
    {
      type: 'confirm',
      name: 'initConfirm',
      message: 'You are not in the root of an existing project. Do you like to initialize a new project here?',
      default: false
    }
  ];
  return (await inquirer.prompt(questions)).confirm;
}

export const add = async (type: string, command: Command) => {
  clear()
  drawHeader()
  if (!isProjectInitialized()) {
    const initProjectReply = await getConfirmInitProject()
    if (!initProjectReply) {
      return
    }
    await initProject()
  }

  switch (type.toUpperCase()) {
    case 'UI': {
      console.log(chalk.whiteBright('Create a new UI project with TypeScript and Parcel'))
      const appName = toKebabCase(command.appName || await getAppName())
      mkdirSync(`./src/${appName}`, { recursive: true })

      const instDepSpin = createSpinner('Install dependencies')
      await run(
        'npm install react react-dom @actyx/pond fp-ts@1.19.4 io-ts@1.10.1 io-ts-types@0.4.1 rxjs@5.5.12 @actyx-contrib/react-pond @actyx-contrib/registry @actyx/industrial-ui'
      )
      instDepSpin()

      const instDevDepSpin = createSpinner('Install dev dependencies')
      await run('npm install -D parcel-bundler @types/react @types/react-dom typescript')
      instDevDepSpin()

      const setupProject = createSpinner('Create template')
      writeFileSync(`./src/${appName}/index.html`, defaultHtml)
      writeFileSync(`./src/${appName}/root.tsx`, defaultRootTsx)
      writeFileSync(`./src/${appName}/App.tsx`, defaultAppTsx)
      setupProject()

      const addScripts = createSpinner('Add project to package.json')
      const packageJson = JSON.parse(readFileSync('./package.json').toString())
      packageJson.scripts = {
        ...packageJson.scripts ,
        [`ui:${appName}:start`]: `parcel src/${appName}/index.html --out-dir build/${appName}/debug`,
        [`ui:${appName}:build`]: `parcel build src/${appName}/index.html --out-dir build/${appName}/release --public-url ./`,
      }
      writeFileSync('./package.json', JSON.stringify(packageJson, undefined, 2))
      addScripts()
      break
    }
    case 'APP':
    case 'NODE': {
      console.log(chalk.whiteBright('Create a new NodeJS project with TypeScript'))
      const appName = toKebabCase(command.appName || await getAppName())
      mkdirSync(`./src/${appName}`, {recursive: true})

      const instDepSpin = createSpinner('Install dependencies')
      await run(
        'npm install @actyx/pond fp-ts@1.19.4 io-ts@1.10.1 io-ts-types@0.4.1 rxjs@5.5.12 @actyx-contrib/registry'
      )
      instDepSpin()

      const instDevDepSpin = createSpinner('Install dev dependencies')
      await run('npm install -D ts-node @types/node typescript')
      instDevDepSpin()


      const setupProject = createSpinner('Create template')
      writeFileSync(`./src/${appName}/index.ts`, defaultIndexTs)
      setupProject()

      const addScripts = createSpinner('Add project to package.json')
      const packageJson = JSON.parse(readFileSync('./package.json').toString())
      packageJson.scripts = {
        ...packageJson.scripts ,
        [`node:${appName}:start`]: `ts-node src/${appName}/index.ts`,
        [`node:${appName}:build`]: `tsc src/${appName}/index.ts -p tsconfig.json`,
        [`node:${appName}:build:watch`]: `tsc src/${appName}/index.ts -p tsconfig.json -w`,
      }
      writeFileSync('./package.json', JSON.stringify(packageJson, undefined, 2))
      addScripts()
      break
    }
    default:
      console.log(chalk.red('App type not supported. Use UI ore NODE'))
      return
  }
}

