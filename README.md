# Actyx-Project-CLI

Create a new project within seconds and start something awesome! This tool gives you the opportunely to create a nodeJS or a React application with one command

### install

Install the Actyx-Project-CLI globally to have access to in wherever you are.

```bash
npm install -g @actyx-contrib/actyx-project-cli
```

### init Project

The installed `axp` tool will create you a monorepo with git, esLint, and TypeScript. In this project you can add your apps with the `axp add <appType>` command.

The init step is optional and can you directly create an app with `axp add <appType>`

```bash
axp init
```

### React application

Create a new React-App with the `axp add ui` command. It will user *parcel* as build tool and setup *jest* for testings.

Additional to this. The actyx manifest for a WebView App is generated.

```bash
axp add ui --name AwesomeUi
```

After executing this command you will find some new scripts in you package.json

- `ui:appName:start` run the app in dev mode with automatic rebuild
- `ui:appName:build` build the React application to deploy it
- `ui:appName:package` use the ax-manifest to create a deployable package

### Node application

The installed `axp` tool will create you a monorepo with linters and other useful tools in.

```bash
axp add ui --name AwesomeUi
```

After executing this command you will find some new scripts in you package.json

- `node:appName:start` run the app in dev mode with automatic rebuild
- `node:appName:build` build the node js application to deploy it
- `node:appName:package` use the ax-manifest to create a deployable package
