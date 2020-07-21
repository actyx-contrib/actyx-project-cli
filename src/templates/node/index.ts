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
export const defaultIndexTs = `import { Pond } from '@actyx/pond'

Pond.default().then((pond) => {
  // start something awesome here
  //
  // -------------------------------
  //
  // For the first time here?
  // https://developer.actyx.com/docs/pond/getting-started
  //
  // You will find help and examples on:
  // https://developer.actyx.com/docs/pond/guides/hello-world
  // https://developer.actyx.com/blog
})
`

export const dockerfile = (appName: string): string => `FROM node:10-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production
COPY build/${appName}/. .

CMD ["node", "index.js"]
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
settingsSchema: ./settings-schema.json # <---- you could also inline the settings schema
`

export const dockerComposeAmd64 = (appName: string): string => `version: '2.0'
services:
  app:
    image: ${appName}
`

export const dockerComposeArm64v8 = (appName: string): string => `version: '2.0'
services:
  app:
    image: ${appName}
`

export const settingsSchema = `{
    "default": {}
}
`
