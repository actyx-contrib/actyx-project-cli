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
})`

export const storybookWebpack = `const path = require("path");
module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve("awesome-typescript-loader")
      },
    ],
  });
  config.resolve.extensions.push(".ts", ".tsx");
  return config;
};`

export const storybookAppStory = `import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { App } from './App'

storiesOf('App', module).add('base', () => <App />);`
