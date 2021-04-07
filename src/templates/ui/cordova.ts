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
export const cordovaPackageJson = (appName: string): string => `{
  "name": "${appName}",
  "displayName": "${appName}",
  "version": "1.0.0",
  "description": "missing",
  "main": "index.js",
  "scripts": {},
  "keywords": [
    "ecosystem:cordova"
  ],
  "license": "Apache-2.0",
  "devDependencies": {
    "cordova-android": "^9.0",
    "cordova-electron": "^1.1",
    "cordova-plugin-whitelist": "^1.3",
    "fs-extra": "^9.1.0"
  },
  "cordova": {
    "plugins": {
      "cordova-plugin-whitelist": {},
    },
  }
}
`

export const cordovaConfigXml = (appName: string): string => `<?xml version='1.0' encoding='utf-8'?>
<widget id="${appName}" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>${appName}</name>
    <description>
        TODO
    </description>
    <author email="TODO" href="http://TODO">
      TODO
    </author>
    <content src="index.html" />
    <access origin="*" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    <allow-intent href="tel:*" />
    <allow-intent href="sms:*" />
    <allow-intent href="mailto:*" />
    <allow-intent href="geo:*" />
    <platform name="android">
        <allow-intent href="market:*" />
    </platform>
    <platform name="ios">
        <allow-intent href="itms:*" />
        <allow-intent href="itms-apps:*" />
    </platform>
    <hook />
    <hook type="before_prepare" src="scripts/buildApp.js" />
</widget>
`

export const cordovaGitIgnore = `.DS_Store

# Generated by package manager
node_modules/

# Generated by Cordova
/plugins/
/platforms/
/www/*
!/www/gitkeep
`

export const cordovaBuildScripts = (
  appName: string,
): string => `/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'
const appName = '${appName}'

console.log('⚙️ start build ' + appName)
const { copySync, removeSync, writeFileSync } = require('fs-extra')
const { resolve, join } = require('path')
const { execSync } = require('child_process')

var dir = resolve(__dirname, '..')
var projectMain = resolve(dir, '../../..')
var htmlSource = join(projectMain, \`build/\${appName}/release\`)
var outputDir = join(dir, 'www')

const main = () => {
  console.log('➡️ cd to ' + projectMain)
  process.chdir(projectMain)

  console.log(\`➡️ exec npm run ui:\${appName}:build ⏳\`)
  execSync(\`npm run ui:\${appName}:build\`)

  console.log(\`➡️ clear cordova www folder\`)
  removeSync(outputDir)

  console.log(\`➡️ copy build to www folder\`)
  copySync(htmlSource, outputDir)

  writeFileSync(join(outputDir, 'gitkeep'), '')

  console.log(\`➡️ add cordova to the index.html\`)
  const indexHtml = readFileSync(join(outputDir, 'index.html'), "utf8")
  const indexHtmlWithCordova = indexHtml.replace(
    '<body>',
    '<body><script type="text/javascript" src="cordova.js"></script>'
  )
  writeFileSync(join(outputDir, 'index.html'), indexHtmlWithCordova)
  console.log('✅build done')
}
main()
`
