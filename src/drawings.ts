import chalk from 'chalk'
import figlet from 'figlet'

export const drawHeader = () => {
  console.log(
    chalk.yellow(
      figlet.textSync('Actyx Project')
    ),
    '\n'
  )
}
