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
export const defaultHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Actyx-Pond-Demo!</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="root.tsx" type="text/javascript"></script>
  </body>
</html>
`

export const defaultRootTsx = `import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Pond } from '@actyx-contrib/react-pond'
import { App } from './App'

ReactDOM.render(
  <React.StrictMode>
    <Pond loadComponent={<div>Connect to ActyxOS</div>}>
      <App />
    </Pond>
  </React.StrictMode>,
  document.getElementById('root'),
)
`

export const defaultAppTsx = `import * as React from 'react'

export const App = (): JSX.Element => {
  return (
    <div style={{ margin: '120px auto', width: 400 }}>
      <img src="https://raw.githubusercontent.com/actyx-contrib/react-pond/master/icon.png?token=AATHWQIC5RWS62GY3OINH3C645MHQ" />
      <h1>Start something awesome!</h1>
    </div>
  )
}
`

export const axWebManifestYml = (appName: string): string => `manifestVersion: "1.0"
type: web
id: ${appName}
version: 1.0.0
displayName: ${appName}
description: "@ToDo: description"
#icon: ./app-icon.png # Specifying the app icon is optional. If you don't specify an icon for your app, ActyxOS will automatically use a default icon.
dist: ../../build/${appName}/release
main: ../../build/${appName}/release/index.html
settingsSchema: ./settings-schema.json
`
