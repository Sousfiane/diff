import * as core from '@actions/core'

export async function run() {
  try {
    const oldFileB64 = core.getInput('old_file')
    const newFileB64 = core.getInput('new_file')

    const oldFileContent = Buffer.from(oldFileB64, 'base64').toString('utf-8')
    const newFileContent = Buffer.from(newFileB64, 'base64').toString('utf-8')

    console.log('Old file content:\n', oldFileContent)
    console.log('New file content:\n', newFileContent)

    diff(newFileContent, oldFileContent)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

function diff(newFile, oldFile) {
  const newFileArray = newFile.split('\n')
  const oldFileArray = oldFile.split('\n')

  let oldFileIndex
  let diffNewFile = ''
  let diffOldFile = ''

  newFileArray.forEach((element, index) => {
    if (element !== oldFileArray[index]) {
      if (index >= oldFileArray.length) {
        diffNewFile += '<==' + element + '\n'
      } else {
        diffNewFile += '<==' + element + '\n'
        diffOldFile += '==>' + oldFileArray[index] + '\n'
      }
      oldFileIndex = index
    }
  })
  while (oldFileIndex++ < oldFileArray.length - 1) {
    diffOldFile += '==>' + oldFileArray[oldFileIndex] + '\n'
  }
  console.log(diffNewFile.substring(0, diffNewFile.length - 1))
  console.log('--------')
  console.log(diffOldFile.substring(0, diffOldFile.length - 1))
}
