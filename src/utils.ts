import { exec } from 'child_process'
import chalk from 'chalk'

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
    process.stdout.write(chalk.white('✅ ' + text + '\n'))
    clearInterval(spinner)
  }
}

//(new Spinner(text)).setSpinnerString(9).setSpinnerDelay(500).start()

export const run = async (command: string): Promise<void> =>
  new Promise(res => {
    const proc = exec(command)
    proc.on('exit', res)
    proc.on('error', res)
    proc.on('disconnect', res)
  })
