import * as core from '@actions/core'
import { writeFile } from 'node:fs/promises'

export async function run() {
  try {
    const oldFileB64 = core.getInput('old_file')
    const newFileB64 = core.getInput('new_file')

    const oldFileContent = Buffer.from(oldFileB64, 'base64').toString('utf-8')
    const newFileContent = Buffer.from(newFileB64, 'base64').toString('utf-8')

    await diff(newFileContent, oldFileContent)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function diff(newFile, oldFile) {
  const normalizeLineEndings = (str) =>
    str.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const removeNonPrintableChars = (str) =>
    str.replace(/[^\x20-\x7E]/g, '').trim()

  const newFileArray = normalizeLineEndings(newFile).split('\n')
  const oldFileArray = normalizeLineEndings(oldFile).split('\n')

  let diffNewFile = []
  let diffOldFile = []

  const maxLength = Math.max(newFileArray.length, oldFileArray.length)

  for (let index = 0; index < maxLength; index++) {
    const newLine = removeNonPrintableChars(newFileArray[index] || '')
    const oldLine = removeNonPrintableChars(oldFileArray[index] || '')

    if (newLine !== oldLine) {
      if (newLine) diffNewFile.push('<==' + newLine)
      if (oldLine) diffOldFile.push('==>' + oldLine)
    }
  }

  let diffContent = ''

  // Join the differences into strings and print
  if (diffNewFile.length > 0) {
    console.log(diffNewFile.join('\n'))
    diffContent += diffNewFile.join('\n')
  }

  console.log('--------')
  diffContent += '\n--------\n'

  if (diffOldFile.length > 0) {
    console.log(diffOldFile.join('\n'))
    diffContent += diffOldFile.join('\n')
  }

  await writeLogFile(diffContent)
}

async function writeLogFile(content) {
  try {
    await writeFile('./diff.log', content)
    console.log('Diff log successfully created')
  } catch (err) {
    console.error('Failed to write diff log:', err)
  }
}
