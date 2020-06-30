export const defaultIndexTs = `
import { Pond } from '@actyx/pond'

Pond.default().then(pond => {
  // start something awesome here
})
`

export const axDockerManifestYml = (appName: string): string => `manifestVersion: "1.0"
type: docker
id: ${appName}
version: 1.0.0
displayName: ${appName}
description: "@ToDo: description"
dockerCompose:
    x86_64: ./src/${appName}/docker-compose-amd64.yml
    aarch64: ./src/${appName}/docker-compose-arm64v8.yml
settingsSchema: ./src/${appName}/settings-schema.json # <---- you could also inline the settings schema
`

export const dockerComposeAmd64 = (appName: string): string => `version: '2.0'
services:
  app:
    image: ${appName}
`

export const dockerComposeArm64v8 = (appName: string): string =>`version: '2.0'
services:
  app:
    image: ${appName}
`

export const settingsSchema = `{
    "default": {}
}
`
