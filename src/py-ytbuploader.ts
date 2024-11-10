import { execFileSync } from 'child_process'
import os from 'os'
import fs from 'fs'

export default class PYYTBUPLOADER {
  private reName(e: { dir: string; name: string }) {
    if (fs.existsSync(e.dir + '/uploaded') == false) {
      fs.mkdirSync(e.dir + '/uploaded')
    }
    fs.promises.rename(e.dir + '/' + e.name, e.dir + '/uploaded/' + e.name)
  }
  public upload(videoInfo: any, cliArgs: any) {
    let config: string[] = []
    try {
      config = config.concat('-filename', `${videoInfo.dir}${videoInfo.name}`)
      if (videoInfo.name.split('_').length > 2) {
        let nameGroup = videoInfo.name.split('_')
        config.push('-title')
        config.push(
          `【${nameGroup[0]}】 ${
            nameGroup[1].split(' ')[0].replace(/-/, '年').replace(/-/, '月') +
            '日'
          } | ${nameGroup[2].replace(/\.[^.]+$/, '')}`
        )
      }
      if (cliArgs.secrets) {
        config = config.concat(['-secrets', `${cliArgs.secrets}`])
      }
      switch (cliArgs.privacy) {
        case 'public':
          console.log('public')
          config = config.concat(['-privacy', 'public'])
          break
        case 'private':
          console.log('private')
          config = config.concat(['-privacy', 'private'])
          break
        case 'unlisted':
          console.log('unlisted')
          config = config.concat(['-privacy', 'unlisted'])
          break
      }
      console.log(config)
      if (os.type() === 'Windows_NT') {
        execFileSync('./youtubeuploader.exe', config)
      } else {
        execFileSync('./youtubeuploader', config)
      }
      //execFile('../youtubeuploader.exe', config,{shell:true}).stdout?.pipe(process.stdout)
      this.reName(videoInfo)
    } catch (err) {
      throw err
    }
  }
}
