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
import { PondVersions } from '../../utils'

export const defaultIndexTs = (version: PondVersions): string => {
  switch (version) {
    case PondVersions.Version1:
    case PondVersions.Version2:
      return defaultIndexTsV1_2
    case PondVersions.Version3:
    default:
      return defaultIndexTsWithManifest
  }
}

export const defaultIndexTsV1_2 = `import { Pond } from '@actyx/pond'

Pond.default().then((pond) => {
  // start something awesome here
  // -------------------------------
  //
  // For the first time here?
  // https://developer.actyx.com/docs/how-to/overview
  //
  // You will find help and examples on:
  // https://developer.actyx.com/docs/tutorials/overview
  // https://developer.actyx.com/blog
})
`
export const defaultIndexTsWithManifest = `import { Pond } from '@actyx/pond'
import manifest from './manifest'

Pond.default(manifest).then((pond) => {

  console.log(pond.info())

  // start something awesome here
  // -------------------------------
  //
  // For the first time here?
  // https://developer.actyx.com/docs/how-to/overview
  //
  // You will find help and examples on:
  // https://developer.actyx.com/docs/tutorials/overview
  // https://developer.actyx.com/blog
})
`

export const appNodeManifest = (
  appName: string,
): string => `import { AppManifest } from "@actyx/pond"

export const manifest: AppManifest = {
  appId: 'com.example.node.app',
  displayName: '${appName}',
  version: '0.0.1'
}

export default manifest
`

export const dockerfile = (appName: string): string => `FROM node:16-alpine as build
WORKDIR /usr/src/app

COPY src/${appName}/package-prod.json ./package.json
RUN npm install --production
COPY build/${appName}/. .

FROM node:10-alpine
COPY --from=build /usr/src/app /
CMD ["node", "./${appName}/index.js"]
`
export const packageJsonProd = (appName: string, pondVersion: PondVersions): string => `{
  "name": "${appName}",
  "version": "1.0.0",
  "main": "${appName}/index.js",
  "license": "ISC",
  "dependencies": {
    "@actyx/pond": ${
      pondVersion === PondVersions.Version1
        ? '"1.1"'
        : pondVersion === PondVersions.Version2
        ? '"2"'
        : '"3"'
    }
  }
}
`

export const axDockerManifestYml = (appName: string): string => `manifestVersion: "1.0"
type: docker
id: ${appName}
version: 1.0.0
displayName: ${appName}
description: "@ToDo: description"
dockerCompose:
    x86_64: ./docker-compose-amd64.yml
    aarch64: ./docker-compose-arm64v8.yml
settingsSchema: ./settings-schema.json
`

export const dockerComposeAmd64 = (appName: string): string => `version: '2.0'
services:
  app:
    image: ${appName}
`

export const dockerComposeArm64v8 = (appName: string): string => `version: '2.0'
services:
  app:
    image: ${appName}-aarch64
`

export const settingsSchema = `{
    "default": {}
}
`
