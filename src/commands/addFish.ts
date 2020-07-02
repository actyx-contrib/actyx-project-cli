/*
 *Copyright 2020 Actyx AG
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { existsSync, writeFileSync, readFileSync } from 'fs'
import chalk from 'chalk'
import { Command } from 'commander'
import { changeToProjectRoot, toPascalCase } from '../utils'
import { clear } from 'console'
import { drawHeader } from '../drawings'

const optionString = (option: boolean | undefined, placeHolder: string): string => {
  if (option) {
    return '\n' + placeHolder
  } else {
    return ''
  }
}

export const addFish = async (fishName: string, command: Command): Promise<void> => {
  clear()
  drawHeader()
  if (!changeToProjectRoot()) {
    console.log(chalk`{red project is not initialized}`)
    return
  }
  const options: CreateFishBodyOptions = {
    noEventCommandExample: command.noExample,
    noSnapshots: command.noSnapshot,
    withRegistry: command.registry,
  }

  createFish(fishName, options)
}

export const toSemantics = (str: string): string => {
  const [first = '', ...rest] = str
  return `${first.toLowerCase()}${rest.join('')}`
}
export const createFish = (fish: string, options: CreateFishBodyOptions): void => {
  const name = fish.toLowerCase().endsWith('fish') ? fish.substr(0, fish.length - 4) : fish
  const fishName = `${name}Fish`

  const fishFile = `./src/fish/${fishName}.ts`
  const fishIndexFile = `./src/fish/index.ts`
  if (existsSync(fishFile)) {
    console.log(chalk`{yellow Fish ${fishName} do already exists}`)
    return
  }

  writeFileSync(fishFile, createFishBody(fishName, toSemantics(name), options))

  const indexTsContent = existsSync(fishIndexFile)
    ? readFileSync(fishIndexFile).toString() + '\n'
    : ''
  const newIndexTsContent = `${indexTsContent}${createFishExport(name, options)}`
  writeFileSync(fishIndexFile, newIndexTsContent)
}

export const createFishExport = (name: string, options: CreateFishBodyOptions): string => {
  const upperName = toPascalCase(name)

  return `export {
  ${upperName}Fish,${optionString(options.withRegistry, `  ${upperName}FishRegistry,`)}
  Event as ${upperName}Event,
  EventType as ${upperName}EventType,
  Command as ${upperName}Command,
  CommandType as ${upperName}CommandType,
  State as ${upperName}State,
  PublicState as Public${upperName}State,
} from './${name}Fish'
`
}

type CreateFishBodyOptions = {
  noEventCommandExample: boolean
  noSnapshots: boolean
  withRegistry: boolean
}

export const createFishBody = (
  fishName: string,
  semantics: string,
  options: CreateFishBodyOptions,
): string => {
  const upperFishName = toPascalCase(fishName)

  return `import {
  Envelope,
  FishType,
  InitialState,
  OnCommand,
  OnEvent,
  OnStateChange,
  Semantics,
  Subscription,${optionString(!options.noSnapshots, '  SnapshotFormat,')}
} from '@actyx/pond'${
    options.withRegistry
      ? `
import { createRegistryFish } from '@actyx-contrib/registry'`
      : ''
  }

/*
 * Fish State
 */
export type State = {}
export type PublicState = State
const initialState: InitialState<State> = (name, _sourceId) => ({
  state: {},
  subscriptions: [Subscription.of(${upperFishName}, name)],
})
${optionString(!options.noEventCommandExample, eventCommandExample)}${optionString(
    !options.noSnapshots,
    localSnapshot,
  )}
/*
 * Fish Definition
 */
export const ${upperFishName} = FishType.of<State, Command, Event, PublicState>({
  semantics: Semantics.of('ax.${semantics}'),
  initialState,
  onEvent,
  onCommand,
  onStateChange: OnStateChange.publishPrivateState(),${optionString(
    !options.noSnapshots,
    `  localSnapshot,
  semanticSnapshot: (_name, _sourceId) => (_ev) => false,`,
  )}
})${optionString(
    options.withRegistry,
    `export const ${upperFishName}Registry = createRegistryFish(${upperFishName}, '', '')`,
  )}
`
}

const eventCommandExample = `/**
 * Fish Events
 */
export enum EventType {
  example = 'example',
}
export type ExampleEvent = {
  type: EventType.example
  example: string
}
export type Event = ExampleEvent

export const onEvent: OnEvent<State, Event> = (state: State, event: Envelope<Event>) => {
  const { payload } = event
  switch (payload.type) {
    case EventType.example: {
      console.error('implementation missing EventType.example')
      return state
    }
  }
  return state
}

/**
 * Fish Commands
 */
export enum CommandType {
  example = 'example',
}
export type ExampleCommand = {
  type: CommandType.example
  example: string
}
export type Command = ExampleCommand

export const onCommand: OnCommand<State, Command, Event> = (_state: State, command: Command) => {
  switch (command.type) {
    case CommandType.example: {
      return [
        {
          type: EventType.example,
          example: command.example,
        },
      ]
    }
  }
  return []
}
`

const localSnapshot = `/*
 * Local Snapshot
 */
const localSnapshot: SnapshotFormat<State, any> = {
  version: 1,
  serialize: (state) => state,
  deserialize: (state) => state as State,
}
`
