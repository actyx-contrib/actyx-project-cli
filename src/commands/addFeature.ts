import { Command } from 'commander'
import chalk from 'chalk'
import { createSpinner, run, toKebabCase, packageInstalled } from '../utils'
import { existsSync, writeFileSync, readFileSync } from 'fs'
import clear from 'clear'
import { drawHeader } from '../drawings'
import { jestExample, jestConfigJs } from '../templates/main/jest'
import { jestDevPackages } from '../templates/packages'

export const addFeature = async (
  project: string,
  feature: string,
  _command: Command,
): Promise<void> => {
  clear()
  drawHeader()
  const projectPath = `./src/${toKebabCase(project)}`
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
    case 'jest': {
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
        [`ui:${appName}:test`]: `TZ=UTC jest  --collectCoverageFrom="['./src/${appName}/**/*.{ts,tsx}', '!**/*.d.ts']" --coverageDirectory="<rootDir>/coverage/${appName}" ./src/${appName}`,
        [`ui:${appName}:test:noCoverage`]: `TZ=UTC jest --coverage=false ./src/${appName}`,
        [`ui:${appName}:test:watch`]: `TZ=UTC jest --coverage=false --watch ./src/${appName}`,
      }
      writeFileSync('./package.json', JSON.stringify(packageJson, undefined, 2))
      addScriptsDone()

      break
    }

    default:
      console.log(chalk`{red Feature ${feature} is not supported}`)
      return
  }
}
