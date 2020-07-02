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
export const jestConfigJs = `module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/*.d.ts'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
  coverageDirectory: '<rootDir>/coverage',
  modulePathIgnorePatterns: ['<rootDir>/lib', '<rootDir>/docs', '<rootDir>/example'],
  coverageThreshold: {
    global: {
      statements: 89,
      branches: 84,
      functions: 89,
      lines: 89,
    },
  },
}
`

export const jestExample = (appName: string): string => `describe('${appName}', () => {
  describe('example', () => {
    it('do test', () => {
      expect(true).toBeTruthy()
    })
  })
})
`
