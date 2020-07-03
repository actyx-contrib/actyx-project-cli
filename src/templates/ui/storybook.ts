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
export const storybookMain = `module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-actions/register'],
};`

export const storybookPreview = `const { addParameters } = require('@storybook/react')
const { create } = require('@storybook/theming/create')

addParameters({
  options: {
    theme: create({
      base: 'light',
      brandTitle:''
    }),
  },
})
`

export const storybookWebpack = `module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve("awesome-typescript-loader")
      },
    ],
  })
  config.resolve.extensions.push(".ts", ".tsx")
  return config
}
`

export const storybookAppStory = (
  appName: string,
): string => `import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { App } from './App'

storiesOf('${appName}/App', module).add('base', () => <App />)
`
