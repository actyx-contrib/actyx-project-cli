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
export const uiPackages = [
  'react',
  'react-dom',
  '@actyx/pond',
  'fp-ts@1.19.5',
  'io-ts@1.10.4',
  'io-ts-types@0.4.8',
  'rxjs@5.5.12',
  '@actyx-contrib/react-pond',
  '@actyx-contrib/registry',
  '@actyx/industrial-ui',
]
export const uiDevPackages = ['parcel-bundler', '@types/react', '@types/react-dom', 'typescript']

export const nodePackages = [
  '@actyx/pond',
  'fp-ts@1.19.5',
  'io-ts@1.10.4',
  'io-ts-types@0.4.8',
  'rxjs@5.5.12',
  '@actyx/os-sdk',
  '@actyx-contrib/registry',
]

export const nodeDevPackages = ['ts-node', 'nodemon', '@types/node', 'typescript']

export const jestDevPackages = ['jest', 'ts-jest', 'babel-jest', '@types/jest']

export const storybookDevPackages = ['@storybook/addon-actions', '@storybook/react', '@storybook/theming']