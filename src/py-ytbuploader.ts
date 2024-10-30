import { execFileSync } from 'node:child_process'
import { log } from 'node:console'
interface VideoInfoItem {
  dir: string
  name: string
}
export default class PYYTBUPLOADER {
  public upload(videoInfo: VideoInfoItem, cliArgs: any) {
    let config = []

    config.push(`--filename "${videoInfo.dir}${videoInfo.name}"`)
    if (videoInfo.name.split('_').length > 2) {
      let nameGroup = videoInfo.name.split('_')
      config.push(
        `--title "【${nameGroup[0]}】 ${
          nameGroup[1].split(' ')[0].replace(/-/, '年').replace(/-/, '月') +
          '日'
        } | ${nameGroup[2].replace(/\.[^.]+$/, '')}"`
      )
    }
    if (cliArgs.secrets) {
      config.push(`--secrets "${cliArgs.secrets}"`)
    }
    if (cliArgs.o) {
      config.push('--privacy public')
    }
    if (cliArgs.p) {
      config.push('--privacy private')
    }
    if (cliArgs.u) {
      config.push('--privacy unlisted')
    }
    log(config)
    execFileSync('../youtubeuploader.exe', config)
  }
}
