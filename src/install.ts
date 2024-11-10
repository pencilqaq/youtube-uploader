import { spawn } from 'child_process'

export class Install {
  public async install() {
    console.log('目前只有下载功能 下载后的压缩包需要自行解压到运行目录中')
    await fetch(
      'https://api.github.com/repos/porjo/youtubeuploader/releases/latest'
    )
      .then((res) => res.json())
      .then((text) => {
        const regex = /.*\.txt$/i
        let assetMap = new Map()
        let selectMap = new Map()
        for (const asset of text.assets) {
          if (regex.test(asset.name)) {
            continue
          }
          assetMap.set(asset.name, asset.browser_download_url)
        }
        let i = 1
        for (const [key] of assetMap) {
          console.log(`${i}. ${key}`)
          selectMap.set(i, key)
          i++
        }
        process.stdin.setEncoding('utf8')
        console.log('下载（输入对应序号）：')
        process.stdin.on('data', (data: string) => {
          const name = data.trim()
          const selectMapValue = selectMap.get(Number(name))
          const child = spawn('curl', [
            '-L',
            `${assetMap.get(selectMapValue)}`,
            '-o',
            `${selectMapValue}`,
          ])
          child.on('close', (code) => {
            console.log(`child process exited with code ${code}`)
          })
          if (selectMapValue) {
            console.log(`开始下载：${selectMapValue}`)
            child.stdout.pipe(process.stdout)
            child.stderr.pipe(process.stderr)
          } else {
            console.log('输入错误')
            process.exit()
          }
          process.stdin.pause()
        })
      })
  }
}
