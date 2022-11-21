# IMPORTANT NOTICE

**This repository has been archived and is no longer maintained. You are welcome to copy the code into your own projects and continue using it at your own discretion and risk.**

<img width="130px" src="https://raw.githubusercontent.com/actyx-contrib/actyx-project-cli/master/axp-icon.png?token=AATHWQLXCUBBKEM6TMDEXYC674JUG">

# Actyx-Project-CLI

Create a new project within seconds and start something awesome! This tool gives you the opportunity to create a TypeScript Node.js or a React application with one command.

## 📦 Installation

Install the Actyx-Project-CLI globally to have access to wherever you are. [npm package](https://www.npmjs.com/package/@actyx-contrib/axp).

```shell
npm install -g @actyx-contrib/axp
```

## 🛠️ Init Project

The installed `axp` tool will create you a monorepo with git, ESLint, and TypeScript.

In this project, you can add your apps with the `axp add <appType>` command.

```bash
axp init
```

The init step is optional. You can directly create an new app with `axp add [ui|node]`

## 📑 React application

Create a new React-App with the `axp add ui` command. It will user _parcel_ as build tool.

The actyx manifest for a WebView app is generated automatically.

```bash
axp add ui --appName "awesome Ui" --test
```

After executing this command you will find some new scripts in you package.json

- `ui:<appName>:start` run the app in dev mode with automatic rebuild
- `ui:<appName>:build` build the React application to deploy it

## 📑 Node application

Create a new Node.js with the `axp add node` command.

```bash
axp add node --appName "awesome App" --test --docker
```

After executing this command you will find some new scripts in you package.json

- `node:<appName>:start` run the `index.ts` in your application
- `node:<appName>:build` build the node js application to deploy it
- `node:<appName>:clean` remove the build folder.

## 🛠️ Add features

In AXP some widely used standard tools have been integrated, which can be activated via `axp addFeature <appName> <feature>`.

### UI apps

The following features are available for your UI application.

- `test` / `jest`: Add jest as test suit to your application and generate an example test for you. ([jestjs.io](https://jestjs.io/docs/getting-started))
- `storybook`: Add storybook to your complete project and add an example to your selected app. ([storybook.js.org](https://storybook.js.org/docs/react/get-started/introduction))
- `cordova`: Add a cordova wrapper in the app to package your app as executable for Android / Windows / MAC. ([cordova.apache.org](https://cordova.apache.org/))

### Node apps

The following features are available for a node application.

- `test` / `jest`: Both commands add jest as test suit to your application and generate an example test for you ([jestjs.io](https://jestjs.io/docs/getting-started))
- `docker`: Create some docker definitions to deploy your application as container ([docker.com](https://docs.docker.com/engine/reference/builder/))

## 📖 Commands

This list is a overview of the existing commands. Use the integrated help to get detailed information about the commands

| command                                      | shortcut          | Function                                                                           |
| -------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------- |
| `axp init`                                   | `axp --init -v 3` | Initialize a new project in the current directory                                  |
| `axp add <type> [-n Name] [--test] [--jest]` | `axp a`           | Create a new application with the given type and name                              |
| `axp addFeature <appName> <feature>`         | `axp af`          | Add a new feature to the appName (test / jest / storybook / cordova / docker)      |
| `axp list`                                   | `axp ls`          | List all existing apps and check if some unreferenced apps are in the package.json |
| `axp clean`                                  | `axp c`           | Remove unreferenced commands in the package.json                                   |
| `axp help`                                   | `axp -h`          | Show the general help output                                                       |
| `axp <command> --help`                       | `<shortcut> -h`   | Show the help output for a given command                                           |
| `axp --version`                              | `axp -V`          | axp version                                                                        |

## 🤓 Developer tools

The best way to work and test the project is to run the `npm run build:watch` and `npm link` it once. From this moment on, you can manipulate the code and try the `axp` cli command in any directory

| Script                      | Description                                                       |
| --------------------------- | ----------------------------------------------------------------- |
| `npm run clean`             | Clean lib and coverage folders                                    |
| `npm run build`             | Build project                                                     |
| `npm run build:watch`       | Build project watch mode                                          |
| `npm run lint`              | Check for lint issues                                             |
| `npm run lint:fix`          | Check and automatically fix lint issues                           |
| `npm run license:add`       | Append license information to every relevant files                |
| `npm run license:check`     | Check if license information is present on every relevant files   |
| `npm run license:check-dep` | Check the licenses for project dependencies and produce a summary |
