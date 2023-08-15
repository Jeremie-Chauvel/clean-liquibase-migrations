import fs from 'node:fs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import yaml from 'js-yaml'
import { removeDuplicateUniqueConstraints } from '../src/remove-duplicate-unique-constraints'

vi.mock('picocolors', () => ({
  default: {
    bold: str => str,
    yellow: str => str,
  },
}))

describe('Clean liquibase migration', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('should clean unique constraints', () => {
    const consoleWarnMock = vi.fn()
    vi.spyOn(console, 'warn').mockImplementation(consoleWarnMock)

    const input = yaml.load(fs.readFileSync('./test/test-clean-unique-constraints/input.yaml', 'utf8'))
    const output = removeDuplicateUniqueConstraints(input)

    expect(consoleWarnMock).toHaveBeenCalledTimes(2)
    expect(consoleWarnMock).toHaveBeenCalledWith('Duplicate drop and add unique constraint detected: UC_NAME_LOWER_CASE_COL')
    expect(consoleWarnMock).toHaveBeenCalledWith('Duplicate drop and add unique constraint detected: UC_LABEL_COL')

    const expected = yaml.load(fs.readFileSync('./test/test-clean-unique-constraints/expected.yaml', 'utf8'))
    expect(output).toEqual(expected)
  })

  it('should throw when cleaning up leaves no changes', () => {
    const consoleWarnMock = vi.fn()
    vi.spyOn(console, 'warn').mockImplementation(consoleWarnMock)

    const input = yaml.load(fs.readFileSync('./test/test-clean-unique-constraints/input-no-changes-left.yaml', 'utf8'))

    expect(() => removeDuplicateUniqueConstraints(input),
    ).toThrowError('No change left after removing duplicate unique constraints')

    expect(consoleWarnMock).toHaveBeenCalledTimes(1)
    expect(consoleWarnMock).toHaveBeenCalledWith('Duplicate drop and add unique constraint detected: UC_SURNAME_COL')
  })
})
