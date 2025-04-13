import * as core from '@actions/core'

export async function run() {
  try {
    const oldFileB64 = core.getInput('old_file')
    const newFileB64 = core.getInput('new_file')

    const oldFileContent = Buffer.from(oldFileB64, 'base64').toString('utf-8')
    const newFileContent = Buffer.from(newFileB64, 'base64').toString('utf-8')

    diff(newFileContent, oldFileContent)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

function diff(newFile, oldFile) {
  const newFileArray = newFile.split('\n')
  const oldFileArray = oldFile.split('\n')

  let diffNewFile = []
  let diffOldFile = []

  const maxLength = Math.max(newFileArray.length, oldFileArray.length)

  for (let index = 0; index < maxLength; index++) {
    const newLine = newFileArray[index] || ''
    const oldLine = oldFileArray[index] || ''

    if (newLine !== oldLine) {
      if (newLine) diffNewFile.push('<==' + newLine)
      if (oldLine) diffOldFile.push('==>' + oldLine)
    }
  }

  // Join the differences into strings and print
  if (diffNewFile.length > 0) {
    console.log(diffNewFile.join('\n'))
  }
  console.log('--------')
  if (diffOldFile.length > 0) {
    console.log(diffOldFile.join('\n'))
  }
}
