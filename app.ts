import minimist from 'minimist'
import Default from './src/default'
import PYYTBUPLOADER from './src/py-ytbuploader'
import { Install } from './src/install'

const defaultIn = new Default()
const pyYtbUploader = new PYYTBUPLOADER()
const cliArgs = minimist(process.argv.slice(2))

async function runPy() {
  let video = await defaultIn.walkDir(cliArgs.dir)
  //log(video)
  for (const uploadInfo of video) {
    pyYtbUploader.upload(uploadInfo, cliArgs)
  }
}

async function runPy2() {
  let video = await defaultIn.readDir(cliArgs.dir)
  //log(video)
  for (const uploadInfo of video) {
    pyYtbUploader.upload(uploadInfo, cliArgs)
  }
}

async function app() {
  if (cliArgs.i) {
    runPy()
  } else {
    runPy2()
  }
}

console.log(cliArgs)

if (cliArgs.install) {
  new Install().install()
} else {
  app()
}
