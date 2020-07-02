import chalk from 'chalk'
import figlet from 'figlet'

export const drawHeader = (): void => {
  console.log(chalk`{yellow${figlet.textSync('Actyx Project')} \n}`)
}
