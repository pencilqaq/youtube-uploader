import minimist from 'minimist'
import Default from './src/default'
import Index from './src/index'
import PYYTBUPLOADER from './src/py-ytbuploader'
import { CronJob } from 'cron'
import { log } from 'console'

const defaultIn = new Default()
const index = new Index()
const pyYtbUploader = new PYYTBUPLOADER()
const cliArgs = minimist(process.argv.slice(2))
log(cliArgs)
log(cliArgs.cron.length)

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
  log('new CronJob')
  new CronJob(cliArgs.cron, async () => {
    log('开始运行')
    let video
    if (cliArgs.i) {
      video = await defaultIn.walkDir(cliArgs.dir)
    } else {
      video = await defaultIn.readDir(cliArgs.dir)
    }
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
      log('py l i')
      makeCronJob(cliArgs)
      log('开始运行')
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
