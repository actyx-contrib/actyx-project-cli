import clear from "clear"
import { drawHeader } from "../drawings"
import { Command } from "commander"
import chalk from "chalk";
import inquirer from "inquirer";
import Table from 'cli-table3'
import { isProjectInitialized } from "./init";
import { getProjects } from "./list";
import { readFileSync, writeFileSync } from 'fs';


export const clean = async (_command: Command) => {
  clear()
  drawHeader()
  if (!isProjectInitialized()) {
    console.log(chalk.red('project is not initialized'))
    return
  }

  const { unRefProjects } = getProjects()

  if (unRefProjects.length === 0) {
    console.log(chalk.green('nothing to clean up'))
    return
  }
  if (unRefProjects.length === 1) {
    console.log(chalk.yellow('You have a unlinked project'))
  } else if (unRefProjects.length > 1) {
    console.log(chalk.yellow(`You have ${unRefProjects.length} unlinked projects`))
  }

  if (unRefProjects.length > 0) {
    const unRefTable = new Table()
    unRefTable.push(...unRefProjects.map(e => [e.type, e.name]))
    console.log(unRefTable.toString())
  }

  const confirm = await getConfirm()
  if (!confirm) {
    console.log(chalk.redBright('canceled'))
  }

  const packageJson = JSON.parse(readFileSync('./package.json').toString())
  packageJson.scripts = unRefProjects.reduce((acc, appName) => {
    delete acc[`${appName.type}:${appName.name}:start`]
    delete acc[`${appName.type}:${appName.name}:build`]
    return acc
  }, packageJson.scripts)

  writeFileSync('./package.json', JSON.stringify(packageJson, undefined, 2))
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
      default: false
    }
  ];
  return (await inquirer.prompt(questions)).cleanupConfirm;
}
