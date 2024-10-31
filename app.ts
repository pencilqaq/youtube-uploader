import { log } from 'console'
import minimist from 'minimist'
import Default from './src/default'
import Index from './src/index'
import PYYTBUPLOADER from './src/py-ytbuploader'

const defaultIn = new Default()
const index = new Index()
const pyYtbUploader = new PYYTBUPLOADER()
const cliArgs = minimist(process.argv.slice(2))

if (cliArgs.l && cliArgs.n) {
  throw '参数错误(不允许-l和-n同时存在)'
}

const credentials = {
  email: cliArgs.email,
  pass: cliArgs.password,
  recoveryemail: cliArgs.recemail,
}

log(cliArgs)
if (
  (cliArgs.o && cliArgs.p) ||
  (cliArgs.o && cliArgs.u) ||
  (cliArgs.p && cliArgs.u)
) {
  throw Error('参数-o、-p、-u只能选一个')
}
async function runDefault() {
  if (cliArgs.includeSubdirs || cliArgs.i) {
    if (cliArgs.l) {
      let video = await defaultIn.walkDir(cliArgs.dir)
      for (const uploadInfo of video) {
        pyYtbUploader.upload(uploadInfo, cliArgs)
      }
    } else {
      log('包含子目录')
      let video = index.getUploadInfo(
        await defaultIn.walkDir(cliArgs.dir),
        cliArgs
      )
      log(video)
      for (const uploadInfo of video) {
        await index.testUpload(credentials, uploadInfo)
      }
    }
  } else {
    if (cliArgs.l) {
      let video = await defaultIn.readDir(cliArgs.dir)
      for (const uploadInfo of video) {
        pyYtbUploader.upload(uploadInfo, cliArgs)
      }
    } else {
      log('不包含子目录')
      let video = index.getUploadInfo(
        await defaultIn.readDir(cliArgs.dir),
        cliArgs
      )
      for (const uploadInfo of video) {
        await index.testUpload(credentials, uploadInfo)
      }
    }
  }
}

if (cliArgs.py) {
  if (cliArgs.l) {
  } else {
    runPy()
  }
} else {
  runDefault()
}

async function runPy() {
  let video = await defaultIn.walkDir(cliArgs.dir)
  //log(video)
  for (const uploadInfo of video) {
    log(uploadInfo)
    pyYtbUploader.upload(uploadInfo, cliArgs)
  }
}
