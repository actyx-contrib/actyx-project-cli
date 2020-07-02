<img width="130px" src="https://raw.githubusercontent.com/actyx-contrib/axp/master/axp-icon.png">

# Actyx-Project-CLI

Create a new project within seconds and start something awesome! This tool gives you the opportunity to create a TypeScript Node.js or a React application with one command.

## 📦 Installation

Install the Actyx-Project-CLI globally to have access to wherever you are. [npm package](https://www.npmjs.com/package/@actyx-contrib/axp).

```shell
npm install -g @actyx-contrib/axp
```

## 🛠️ Init Project

The installed `axp` tool will create you a monorepo with git, ESLint, and TypeScript. In this project, you can add your apps with the `axp add <appType>` command.

```bash
axp init
```

The init step is optional. You can directly create an new app with `axp add [ui|node]`

## 📑 React application

Create a new React-App with the `axp add ui` command. It will user *parcel* as build tool and setup *jest* for tests.

Additional to this. The actyx manifest for a WebView App is generated.

```bash
axp add ui --appName "awesome Ui"
```

After executing this command you will find some new scripts in you package.json

- `ui:<appName>:start` run the app in dev mode with automatic rebuild
- `ui:<appName>:build` build the React application to deploy it
- `ui:<appName>:package` use the ax-manifest to create a deployable package

## 📑 Node application

Create a new Node.js with the `axp add node` command. It will setup *jest* for tests.

Additional to this. The actyx manifest for a docker App is generated.

```bash
axp add node --appName "awesome App" --test
```

After executing this command you will find some new scripts in you package.json

- `node:<appName>:start` run the `index.ts` in your application
- `node:<appName>:build` build the node js application to deploy it
- `node:<appName>:package` use the ax-manifest to create a deployable package

## 🐟 Add a new actyx fish

If you are not able to install the VisualStudio Code [Actyx-Pond](https://marketplace.visualstudio.com/items?itemName=Actyx.actyx-pond) extension. You can create templates for your new fish with `axp`.

```bash
axp addFish materialRequest --registry
```

Following options are available when you add a fish:

- `registry` Add a createRegistry to the fish definition
- `noExample` Skip example onEvent and onCommand to build it with the VSCode plugin or write it your self
- `noSnapshot` Remove the snapshot template in the fish definition

## 📖 Commands

This list is a overview of the existing commands. Use the integrated help to get detailed information about the commands

| command | shortcut | Function  |
|---|---|---|
| `axp init` | `axp --init` | Initialize a new project in the current directory |
| `axp add <type> [-n Name] [--test] [--jest]` | `axp a` | Create a new application with the given type and name |
| `axp addFeature <project> <feature>` | `axp af` | Add a new feature to the project (test|jest|storybook) |
| `axp list` | `axp ls` | List all existing projects and check if some unreferenced projects are in the package.json |
| `axp clean` | `axp c` | Remove unreferenced commands in the package.json |
| `axp addFish [options] <fishName>` | `axp fish` | Create a new fish in the src/fish folder. Available options are: --registry --noExample --noSnapshot|
| `axp help` | `axp -h` | Show the general help output |
| `axp <command> --help` | `<shortcut> -h` | Show the help output for a given command |
| `axp --version` | `axp -V` | axp version |

## 🤓 Developer tools

The best way to work and test the project is to run the `npm run build:watch` and `npm link` it once. From this moment on, you can manipulate the code and try the `axp` cli command in any directory

| Script | Description  |
|---|---|
| `npm run clean` | Clean lib and coverage folders |
| `npm run build` | Build project |
| `npm run build:watch` | Build project watch mode |
| `npm run lint` | Check for lint issues |
| `npm run lint:fix` | Check and automatically fix lint issues |
| `npm run license:add` | Append license information to every relevant files |
| `npm run license:check` | Check if license information is present on every relevant files |
| `npm run license:check-dep` | Check the licenses for project dependencies and produce a summary |
