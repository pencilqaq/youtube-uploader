import { log } from 'console'
import minimist from 'minimist'
import Default from './src/default'
import Index from './src/index'

const defaultIn = new Default()
const index = new Index()
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
  if (cliArgs.includeSubdirs) {
    log('包含子目录')
    let video = index.getUploadInfo(
      await defaultIn.walkDir(cliArgs.dir),
      cliArgs
    )
    log(video)
    await index.testUpload(credentials, video)
  } else {
    log('不包含子目录')
    let video = index.getUploadInfo(
      await defaultIn.readDir(cliArgs.dir),
      cliArgs
    )
    log(video)
    await index.testUpload(credentials, video)
  }
}
if (cliArgs.l) {
} else {
  runDefault()
}
