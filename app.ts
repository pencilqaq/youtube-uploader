import minimist from 'minimist'
import Default from './src/default'
import PYYTBUPLOADER from './src/py-ytbuploader'
import { CronJob } from 'cron'
import { log } from 'console'

const defaultIn = new Default()
const pyYtbUploader = new PYYTBUPLOADER()
const cliArgs = minimist(process.argv.slice(2))

if (
  (cliArgs.o && cliArgs.p) ||
  (cliArgs.o && cliArgs.u) ||
  (cliArgs.p && cliArgs.u)
) {
  throw Error('参数-o、-p、-u只能选一个')
}

const credentials = {
  email: cliArgs.email,
  pass: cliArgs.password,
  recoveryemail: cliArgs.recemail,
}

console.log(cliArgs)

async function runPy() {
  let video = await defaultIn.walkDir(cliArgs.dir)
  //log(video)
  for (const uploadInfo of video) {
    pyYtbUploader.upload(uploadInfo, cliArgs)
  }
}

async function runPy2() {
  let video = await defaultIn.walkDir(cliArgs.dir)
  //log(video)
  for (const uploadInfo of video) {
    pyYtbUploader.upload(uploadInfo, cliArgs)
  }
}

function makeCronJob(cliArgs: any) {
  console.log('new CronJob')
  new CronJob(cliArgs.cron, async () => {
    let video
    if (cliArgs.i) {
      video = await defaultIn.walkDir(cliArgs.dir)
    } else {
      video = await defaultIn.readDir(cliArgs.dir)
    }
    log(video)
    for (const uploadInfo of video) {
      pyYtbUploader.upload(uploadInfo, cliArgs)
    }
  }).start()
}

function app() {
  if (cliArgs.py) {
    if (cliArgs.l) {
      if (cliArgs.cron.length == 0) {
        throw Error('参数--cron 没有内容')
      }
      makeCronJob(cliArgs)
    } else {
      if (cliArgs.i) {
        runPy()
      } else {
        runPy2()
      }
    }
  }
}
app()
