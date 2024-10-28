import { upload } from 'youtube-videos-uploader'

export default class index {
  private onVideoUploadSuccess = () => {}
  private video1 = {
    path: '',
    title: '',
    description: '',
    thumbnail: '',
    playlist: '',
    channelName: '',
    onSuccess: this.onVideoUploadSuccess(),
    skipProcessingWait: true,
    onProgress: '' /* (progress: any) => {
      console.log('progress', progress)
    } */,
    uploadAsDraft: false,
    isAgeRestriction: false,
    isNotForKid: false,
    publishType: 'PUBLIC' as 'PUBLIC' | 'PRIVATE' | 'UNLISTED',
    isChannelMonetized: false,
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
  public getUploadInfo(
    videoInfo: { dir: string; name: string }[],
    cliArgs: any
  ) {
    let uploadInfo
    let uploadArray: any[] = []
    videoInfo.forEach((e) => {
      try {
        uploadInfo = this.video1
        uploadInfo.path = e.dir + e.name
        let nameGroup = []
        if (e.name.split('_').length > 2) {
          nameGroup = e.name.split('_')
          uploadInfo.title =
            '【' +
            nameGroup[0] +
            '】' +
            nameGroup[1] +
            ' | ' +
            (nameGroup[2].split(' ')[0].replace(/-/, '年').replace(/-/, '月') +
              '日') +
            ' | ' +
            nameGroup[3].replace(/\.[^.]+$/, '')
          uploadInfo.description = nameGroup[3].replace(/\.[^.]+$/, '')
          uploadInfo.playlist = nameGroup[1]
        }
        if (cliArgs.p) {
          uploadInfo.publishType = 'PRIVATE' as const
        } else if (cliArgs.u) {
          uploadInfo.publishType = 'UNLISTED' as const
        } else {
          uploadInfo.publishType = 'PUBLIC' as const
        }
        uploadArray.push(uploadInfo)
      } catch (err) {
        console.log(err)
      }
    })
    return uploadArray
  }
  public async testUpload(credentials: any, videoInfo: any) {
    await upload(credentials, [videoInfo]).then(console.log)
  }
}
