import clear from 'clear'
import { drawHeader } from '../drawings'
import { Command } from 'commander'
import chalk from 'chalk'
import Table from 'cli-table3'
import { removeDot, changeToProjectRoot } from '../utils'
import { readdirSync, readFileSync } from 'fs'

type PackageJson = {
  scripts: { [key: string]: string }
}

type ProjectTypes = 'ui' | 'node'

type Project = {
  type: ProjectTypes
  name: string
}
type Projects = ReadonlyArray<Project>

type AllProjects = {
  existingProjects: Projects
  unRefProjects: Projects
  allScripts: Projects
}

const isProjectTypes = (t: string): t is ProjectTypes => t === 'ui' || t === 'node'

const decodeName = (name: string): Project | undefined => {
  const [type, ...rest] = name.split(':')
  if (!isProjectTypes(type)) {
    return undefined
  }
  return {
    type,
    name: rest.slice(0, -1).join(':'),
  }
}

const projectStartScripts = (name: string) =>
  (name.startsWith('ui:') || name.startsWith('node')) && name.endsWith(':start')

export const list = (_command: Command): void => {
  clear()
  drawHeader()
  if (!changeToProjectRoot()) {
    console.log(chalk`{red project is not initialized}`)
    return
  }

  const { unRefProjects, existingProjects } = getProjects()
  const table = new Table({ head: ['Type', 'Name'] })
  table.push(...existingProjects.map(e => [e.type, e.name]))
  console.log(table.toString())

  if (unRefProjects.length === 1) {
    console.log(chalk`{redBright ⚠️ You have a unlinked project}`)
  } else if (unRefProjects.length > 1) {
    console.log(chalk`{redBright ⚠️ You have some unlinked projects}`)
  }

  if (unRefProjects.length > 0) {
    const unRefTable = new Table()
    unRefTable.push(...unRefProjects.map(e => [e.type, e.name]))
    console.log(unRefTable.toString())
    console.log(chalk`{white Use} {redBright axp clean} {white to cleanup your project}`)
  }
}

export const getProjects = (): AllProjects => {
  const pJson = JSON.parse(readFileSync('./package.json').toString()) as PackageJson

  const allScripts = Object.keys(pJson.scripts)
    .filter(projectStartScripts)
    .map(decodeName)
    .filter((p): p is Project => p !== undefined)
  const projects = removeDot(readdirSync('./src'))
  const existingProjects = projects
    .map(name => allScripts.find(e => e.name === name))
    .filter((e): e is Project => e !== undefined)

  const unRefProjects = allScripts.filter(e => projects.includes(e.name) === false)

  return {
    existingProjects,
    unRefProjects,
    allScripts,
  }
}
