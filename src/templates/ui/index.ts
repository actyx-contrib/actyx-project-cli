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
export const defaultHtml = (appName: string): string => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appName}</title>
    <style>
      .wrapper {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }
      .loader, .loader:after {
        border-radius: 50%;
        width: 10em;
        height: 10em;
      }
      .loader {
          margin: 3.75em auto;
          font-size: 0.4rem;
          position: relative;
          text-indent: -9999em;
          border-top: 1.1em solid rgba(128, 128, 128, 0.2);
          border-right: 1.1em solid rgba(128, 128, 128, 0.2);
          border-bottom: 1.1em solid rgba(128, 128, 128, 0.2);
          border-left: 1.1em solid #C0C0C0;
          -webkit-transform: translateZ(0);
          -ms-transform: translateZ(0);
          transform: translateZ(0);
          -webkit-animation: loadAnim 1s infinite linear;
          animation: loadAnim 1s infinite linear;
      }
      @-webkit-keyframes loadAnim {
          0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    @keyframes loadAnim {
        0% {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
    </style>
  </head>
  <body>
    <div id="root">
      <div class="wrapper">
        <div class="loader">
          Loading...
        </div>
      </div>
    </div>
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
      <h4>Help and examples:</h4>
      <ul>
        <li>
          <a href="https://developer.actyx.com/blog/2020/06/22/react-pond">
            react-pond - Introduction
          </a>
        </li>
        <li>
          <a href="https://developer.actyx.com/docs/pond/getting-started">Pond - getting-started</a>
        </li>
        <li>
          <a href="https://developer.actyx.com/docs/pond/guides/hello-world">
            Guides - hello-world
          </a>
        </li>
      </ul>
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
main: index.html # App entry point in dist directory
settingsSchema: ./settings-schema.json
`
