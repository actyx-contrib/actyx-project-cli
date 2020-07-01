# Actyx-Project-CLI

Create a new project within seconds and start something awesome! This tool gives you the opportunity to create a TypeScript Node.js or a React application with one command.

## Install

Install the Actyx-Project-CLI globally to have access to wherever you are.

```bash
npm install -g @actyx-contrib/actyx-project-cli
```

## Init Project

The installed `axp` tool will create you a monorepo with git, ESLint, and TypeScript. In this project, you can add your apps with the `axp add <appType>` command.

The init step is optional and can you directly create an app with `axp add <appType>`

```bash
axp init
```

## React application

Create a new React-App with the `axp add ui` command. It will user *parcel* as build tool and setup *jest* for tests.

Additional to this. The actyx manifest for a WebView App is generated.

```bash
axp add ui --name "awesome Ui"
```

After executing this command you will find some new scripts in you package.json

- `ui:<appName>:start` run the app in dev mode with automatic rebuild
- `ui:<appName>:build` build the React application to deploy it
- `ui:<appName>:package` use the ax-manifest to create a deployable package

## Node application

Create a new Node.js with the `axp add node` command. It will setup *jest* for tests.

Additional to this. The actyx manifest for a docker App is generated.

```bash
axp add node --name "awesome App"
```

After executing this command you will find some new scripts in you package.json

- `node:<appName>:start` run the `index.ts` in your application
- `node:<appName>:build` build the node js application to deploy it
- `node:<appName>:package` use the ax-manifest to create a deployable package
