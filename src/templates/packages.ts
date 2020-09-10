import { PondVersions } from '../utils'

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
export const uiPackages = (version: PondVersions): ReadonlyArray<string> => {
  switch (version) {
    case PondVersions.Version1:
      return [
        'react',
        'react-dom',
        '@actyx/pond@1.1',
        'fp-ts@1.19.4',
        'io-ts@1.10.1',
        'io-ts-types@0.4.1',
        'rxjs@5.5.12',
        '@actyx-contrib/react-pond',
        '@actyx-contrib/registry',
        '@actyx/industrial-ui',
      ]
    case PondVersions.Version2:
      return [
        'react',
        'react-dom',
        '@actyx/industrial-ui',
        '@actyx/pond@2.0',
        '@actyx-contrib/react-pond@2',
      ]
  }
}

export const uiDevPackages = ['parcel-bundler', '@types/react', '@types/react-dom', 'typescript']

export const nodePackages = (version: PondVersions): ReadonlyArray<string> => {
  switch (version) {
    case PondVersions.Version1:
      return [
        '@actyx/pond@1.1',
        'fp-ts@1.19.4',
        'io-ts@1.10.1',
        'io-ts-types@0.4.1',
        'rxjs@5.5.12',
        '@actyx/os-sdk',
        '@actyx-contrib/registry',
      ]
    case PondVersions.Version2:
      return ['@actyx/pond@2.0', '@actyx/os-sdk']
  }
}

export const nodeDevPackages = ['ts-node', 'nodemon', '@types/node', 'typescript']

export const jestDevPackages = ['jest', 'ts-jest', 'babel-jest', '@types/jest']

export const storybookDevPackages = [
  '@storybook/addon-actions',
  '@storybook/react',
  '@storybook/theming',
  'awesome-typescript-loader',
  'webpack',
  'webpack-cli',
  'webpack-dev-server',
  'babel-loader',
]
