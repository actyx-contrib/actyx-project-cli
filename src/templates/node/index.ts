export const defaultIndexTs = `
import { Pond } from '@actyx/pond'

Pond.default().then(pond => {
  // start something awesome here

  // First time you are here?
  // Checkout https://developer.actyx.com/docs/pond/getting-started
  //
  // You will find some help and examples on:
  // https://developer.actyx.com/docs/pond/guides/hello-world
  // https://developer.actyx.com/blog
})
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
