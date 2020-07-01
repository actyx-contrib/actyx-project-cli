import { readdirSync, writeFileSync, mkdirSync } from 'fs'
import chalk from 'chalk'
import { createSpinner, run, changeToProjectRoot } from '../utils'
import {
  editorConfig,
  eslintrcJs,
  defaultGitIgnore,
  defaultTsConfig,
  prettierrcJs,
} from '../templates/main'
import clear from 'clear'
import { drawHeader } from '../drawings'

export const isProjectInitialized = (): boolean => {
  const content = readdirSync('.')
  const req = ['src', 'package.json', 'tsconfig.json']
  return req.every(e => content.includes(e))
}

export const initProject = async (): Promise<void> => {
  clear()
  drawHeader()

  changeToProjectRoot() // ignore output, isProjectInitialized will take care

  if (isProjectInitialized()) {
    console.log(chalk.red('Project is already initialized'))
    return
  }

  await setupGit()
  await setupNpm()
  setupTs()
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

const setupNpm = async () => {
  if (readdirSync('.').includes('node_modules')) {
    return
  }

  const spinnerDone = createSpinner('setup npm project')
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
  console.log(chalk`{green done}`)
}

const setupTs = () => {
  if (readdirSync('.').includes('tsconfig.json')) {
    return
  }

  const spinnerDone = createSpinner('Setup TS config')
  writeFileSync('tsconfig.json', defaultTsConfig)
  spinnerDone()
}
