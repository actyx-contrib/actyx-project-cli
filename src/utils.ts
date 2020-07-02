import { exec } from 'child_process'
import chalk from 'chalk'
import { existsSync, readFileSync } from 'fs'
import { parse, join, dirname } from 'path'

export const removeDot = (fileList: string[]): string[] =>
  fileList.filter(e => e !== '.' && e !== '..')

export const toKebabCase = (input: string): string => input.split(' ').join('-')

export const createSpinner = (text: string): (() => void) => {
  const icons = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'.split('')
  let idx = 0
  const drawNext = () => {
    process.stdout.cursorTo(0)
    if (idx++ >= icons.length - 1) {
      idx = 0
    }
    process.stdout.write(chalk.blue(icons[idx]))
    process.stdout.write(chalk.white(' ' + text))
  }

  const spinner = setInterval(() => {
    const cleanDone = process.stdout.clearLine(0, drawNext)
    if (cleanDone === undefined) {
      drawNext()
    }
  }, 80)

  return () => {
    process.stdout.cursorTo(0)
    process.stdout.write(chalk`✅ ${text}\n`)
    clearInterval(spinner)
  }
}

export const run = async (command: string): Promise<void> =>
  new Promise(res => {
    const proc = exec(command)
    proc.on('exit', res)
    proc.on('error', res)
    proc.on('disconnect', res)
  })

export const removeVersions = (npmPackageName: string): string => {
  const repo = npmPackageName.split('/')
  const packageName = repo.pop() || ''
  const name = packageName.includes('@') ? packageName.split('@')[0] : packageName
  const prefix = repo[0] ? repo[0] + '/' : ''
  return prefix + name
}

export const packageInstalled = (packages: string | string[]): boolean => {
  const requiredPackages: string[] = Array.isArray(packages) ? packages : [packages]
  const requiredPackagesWithoutVersion = requiredPackages.map(removeVersions)

  const packageJson = JSON.parse(readFileSync('./package.json').toString())

  const installedPackages = [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {}),
  ]

  return requiredPackagesWithoutVersion.every(px => installedPackages.includes(px))
}

export const changeToProjectRoot = (): boolean => {
  const projectDir = findUp(['package.json'], process.cwd())
  if (projectDir) {
    process.chdir(projectDir)
    return true
  }
  return false
}

export const findUp = (names: string[], currentDir: string): string | undefined => {
  const foundName = names.find(name => existsSync(join(currentDir, name)))

  if (foundName) {
    return currentDir
  } else if (currentDir === parse(currentDir).root) {
    return undefined
  } else {
    return findUp(names, dirname(currentDir))
  }
}
