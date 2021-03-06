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
import {
  createAppManifest,
  createRuntimeSupport,
  createSpinner,
  defaultPondVersion,
  findUp,
  packageInstalled,
  parsePondVersion,
  PondVersions,
  removeDot,
  removeVersions,
  toKebabCaseFileName,
} from './utils'
import fs from 'fs'

const delay = async (time: number): Promise<void> =>
  await new Promise<void>(r => setTimeout(r, time))

describe('utils', () => {
  it('removeDot', () => {
    expect(removeDot(['.', '..'])).toStrictEqual([])
    expect(removeDot(['.a', '..a', '.a.', 'a..'])).toStrictEqual(['.a', '..a', '.a.', 'a..'])
    expect(removeDot(['.', '..', '.', '.a', '..a', '.a.', 'a..'])).toStrictEqual([
      '.a',
      '..a',
      '.a.',
      'a..',
    ])
  })
  it('toKebabCaseFileName', () => {
    expect(toKebabCaseFileName('test')).toBe('test')
    expect(toKebabCaseFileName('TEST')).toBe('test')
    expect(toKebabCaseFileName(' TEST String ')).toBe('test-string')
    expect(toKebabCaseFileName('This is a text')).toBe('this-is-a-text')
  })
  xit('createSpinner', async () => {
    // skipped, chalk is not running reliably under jest
    const steps = 5
    const writeSpy = spyOn(process.stdout, 'write')
    const text = 'testSpinner'
    const terminate = createSpinner(text)
    await delay(80 * steps + 40)
    terminate()

    expect(writeSpy).lastCalledWith(`✅ ${text}\n`)
  })
  it('removeVersions', () => {
    expect(removeVersions('pond')).toBe('pond')
    expect(removeVersions('pond@1.0.0')).toBe('pond')
    expect(removeVersions('pond@^1.0.0')).toBe('pond')
    expect(removeVersions('pond@~1.0.0')).toBe('pond')
    expect(removeVersions('@actyx/pond')).toBe('@actyx/pond')
    expect(removeVersions('@actyx/pond@^1.0.0')).toBe('@actyx/pond')
    expect(removeVersions('@actyx/pond@~1.0')).toBe('@actyx/pond')
  })
  it('PondVersions', () => {
    expect(PondVersions.Version1).toBe(1)
    expect(PondVersions.Version2).toBe(2)
    expect(PondVersions.Version3).toBe(3)
    expect(defaultPondVersion).toBe(PondVersions.Version3)
  })
  it('parsePondVersion', () => {
    expect(parsePondVersion('1')).toBe(PondVersions.Version1)
    expect(parsePondVersion('2')).toBe(PondVersions.Version2)
    expect(parsePondVersion('3')).toBe(PondVersions.Version3)
    expect(parsePondVersion('')).toBe(defaultPondVersion)
    expect(parsePondVersion(undefined)).toBe(defaultPondVersion)

    expect(() => parsePondVersion('0')).toThrow('Version 0 is not supported')
    expect(() => parsePondVersion('4')).toThrow('Version 4 is not supported')
    expect(() => parsePondVersion('1.2.3')).toThrow('Version 1.2.3 is in an invalid format')
    expect(() => parsePondVersion('NO')).toThrow('Version NO is in an invalid format')
  })

  it('createRuntimeSupport', () => {
    expect(createRuntimeSupport(PondVersions.Version1)).toBeTruthy()
    expect(createRuntimeSupport(PondVersions.Version2)).toBeTruthy()
    expect(createRuntimeSupport(PondVersions.Version3)).toBeFalsy()
  })

  it('createAppManifest', () => {
    expect(createAppManifest(PondVersions.Version1)).toBeFalsy()
    expect(createAppManifest(PondVersions.Version2)).toBeFalsy()
    expect(createAppManifest(PondVersions.Version3)).toBeTruthy()
  })

  it('packageInstalled', () => {
    spyOn(fs, 'readFileSync').and.returnValue(
      JSON.stringify({ dependencies: { test: '^1.0.0', other: '^1.0.0' } }),
    )
    expect(packageInstalled('test')).toBeTruthy()
    expect(packageInstalled('test_no')).toBeFalsy()
  })

  it('packageInstalled ind dev-dependencies', () => {
    spyOn(fs, 'readFileSync').and.returnValue(
      JSON.stringify({ devDependencies: { test: '^1.0.0', other: '^1.0.0' } }),
    )
    expect(packageInstalled('test')).toBeTruthy()
    expect(packageInstalled('test_no')).toBeFalsy()
  })

  it('findUp', () => {
    spyOn(fs, 'existsSync').and.returnValues(false, true)
    expect(findUp(['test'], '/a/b/c')).toBe('/a/b')
  })

  it('findUp-2', () => {
    spyOn(fs, 'existsSync').and.returnValues(false, false, true)
    expect(findUp(['test'], '/a/b/c')).toBe('/a')
  })

  it('findUp not found', () => {
    spyOn(fs, 'existsSync').and.returnValues(false, false, false)
    expect(findUp(['test'], '/a/b/c')).toBeUndefined()
  })
})
