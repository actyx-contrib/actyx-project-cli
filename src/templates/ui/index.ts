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
</html>`

export const defaultRootTsx = `import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Pond } from '@actyx-contrib/react-pond'
import { App } from './App'

ReactDOM.render(
  <React.StrictMode>
    <Pond loadComponent={(<div>Connect to ActyxOS</div>)}>
      <App />
    </Pond>
  </React.StrictMode>,
  document.getElementById('root')
)`

export const defaultAppTsx = `import * as React from 'react'

export const App = () => {
  return (
    <div style={{ margin: '120px auto', width: 400 }}>
      <img src="https://raw.githubusercontent.com/actyx-contrib/react-pond/master/icon.png?token=AATHWQIC5RWS62GY3OINH3C645MHQ" />
      <h1>Start something awesome!</h1>
    </div>
  )
}`
