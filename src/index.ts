import { upload } from 'youtube-videos-uploader'
import fs from 'fs'

interface Video2 {
  path: string
  title: string
  description: string
  thumbnail?: string
  playlist?: string
  channelName?: string
  onSuccess?: () => void
  skipProcessingWait?: boolean
  onProgress?: (progress: any) => void // 可选属性
  uploadAsDraft?: boolean
  isAgeRestriction?: boolean
  isNotForKid?: boolean
  publishType?: 'PUBLIC' | 'PRIVATE' | 'UNLISTED'
  isChannelMonetized?: boolean
}

export default class index {
  private async onVideoUploadSuccess(dir: string, name: string) {
    if (dir && name) {
      try {
        console.log(`${dir}/${name} 上传成功`)
        await fs.promises.rename(dir + name, dir + '/uploaded/' + name)
        console.log(`已从${dir}/ 移动到 ${dir}/uploaded/`)
      } catch (err) {
        console.log(err)
      }
    }
  }
  // Extra options like tags, thumbnail, language, playlist etc
  /* const video2 = {
            path: 'e:/demo.flv',
            title: 'title 2',
            description: 'description 2',
            thumbnail: 'thumbnail.png',
            playlist: 'playlist name',
            channelName: 'Channel Name',
            onSuccess: onVideoUploadSuccess,
            skipProcessingWait: true,
            onProgress: (progress) => {
              console.log('progress', progress)
            },
            uploadAsDraft: false,
            isAgeRestriction: false,
            isNotForKid: false,
            publishType: 'PRIVATE',
            isChannelMonetized: false,
          } */
  public async testUpload(credentials: any, videoInfo: any) {
    await upload(credentials, [videoInfo],{args:["--no-sandbox",],}).then(console.log)
  }

  public getUploadInfo(
    videoInfo: { dir: string; name: string }[],
    cliArgs: any
  ) {
    let uploadArray: any[] = []
    for (const e of videoInfo) {
      try {
        let test: Video2 = {
          path: e.dir + e.name,
          title: '',
          description: '',
        }
        if (e.name.split('_').length > 2) {
          let nameGroup = e.name.split('_')
          test.title =
            '【' +
            nameGroup[0] +
            '】' +
            nameGroup[1] +
            ' | ' +
            (nameGroup[2].split(' ')[0].replace(/-/, '年').replace(/-/, '月') +
              '日') +
            ' | ' +
            nameGroup[3].replace(/\.[^.]+$/, '')
          test.description = nameGroup[3].replace(/\.[^.]+$/, '')
          test.playlist = nameGroup[1]
        } else {
          test.title = e.name.replace(/\.[^.]+$/, '')
          test.description = e.name.replace(/\.[^.]+$/, '')
        }
        if (cliArgs.p) {
          console.log('Private')
          test.publishType = 'PRIVATE'
        } else if (cliArgs.u) {
          console.log('Unlisted')
          test.publishType = 'UNLISTED'
        } else {
          console.log('Public')
          test.publishType = 'PUBLIC'
        }
        test.onSuccess = () => {
          if (fs.existsSync(e.dir + '/uploaded') == false) {
            fs.mkdirSync(e.dir + '/uploaded')
          }
          fs.promises.rename(
            e.dir + '/' + e.name,
            e.dir + '/uploaded/' + e.name
          )
        }
        uploadArray.push(test)
      } catch (err) {
        console.log(err)
      }
    }
    return uploadArray
  }
}
