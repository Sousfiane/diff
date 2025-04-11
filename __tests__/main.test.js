import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'

// Mock core module
jest.unstable_mockModule('@actions/core', () => core)

// Dynamically import the module to ensure mocks are applied
const { run } = await import('../src/main.js')

describe('run', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('logs the correct diff when new and old files differ', async () => {
    const oldFile = `line1\nline2\nline3`
    const newFile = `line1\nchanged line2\nline3\nline4`

    core.getInput.mockImplementation((name) => {
      if (name === 'old_file') return oldFile
      if (name === 'new_file') return newFile
    })

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    await run()

    expect(logSpy).toHaveBeenNthCalledWith(1, '<==changed line2\n<==line4')
    expect(logSpy).toHaveBeenNthCalledWith(2, '--------')
    expect(logSpy).toHaveBeenNthCalledWith(3, '==>line2')
  })

  it('calls core.setFailed when error is thrown', async () => {
    // Simulate an invalid input causing `.split('\n')` to throw
    core.getInput.mockImplementation((name) => {
      if (name === 'old_file') return null // this will throw
      if (name === 'new_file') return 'line1\nline2'
    })

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining('Cannot read properties of null')
    )
  })
})
