import fs from 'fs'
import path from 'path'

export default class Default {
  private regexForFile = /^[^~$\.].*(?:\.(mp4|avi|mkv|mov|wmv|flv|webm))$/im
  private regexForDir = /^[~$\.].*|^uploaded$/
  
  public async readDir(dir: string): Promise<any[]> {
    try {
      console.log(`读取目录${dir}中的文件：`)
      let files: any
      try {
        files = await fs.promises.readdir(dir, { withFileTypes: true }) // 异步读取目录内容
      } catch (err: any) {
        if (err.code === 'EPERM') {
          console.log(`权限不足跳过目录${err.path}`)
        } else {
          throw err
        }
      }
      if (files.length == 0) {
        throw Error('当前目录为空')
      }
      files = files.filter((f: { isFile: () => any }) => f.isFile())
      let fileArray: any[] = []
      files.forEach((file: { name: string }) => {
        if (this.regexForFile.test(file.name)) {
          console.log(`获取到文件：${path.join(dir, file.name)}`)
          fileArray.push({
            dir: (dir.replace(/\\+/, '/') + '/').replace(/\/+/, '/'),
            name: file.name,
          })
        }
      })
      if (fileArray.length == 0) {
        throw Error('未获取到视频文件(mp4、avi、mkv、mov、wmv、flv、webm、ts)')
      }
      return fileArray
    } catch (err) {
      throw Error(`读取目录${dir}:  err\n`)
    }
  }

  public async walkDir(dir: string): Promise<any> {
    try {
      console.log(`读取目录${dir}中的文件：`)
      let files: any[] = []
      try {
        files = await fs.promises.readdir(dir, { withFileTypes: true }) // 异步读取目录内容
      } catch (err: any) {
        if (err.code === 'EPERM') {
          console.log(`权限不足跳过目录${err.path}`)
        } else {
          throw err
        }
      }

      let fileArray: any[] = []
      for (const file of files) {
        if (file.isDirectory()) {
          if (this.regexForDir.test(file.name)) {
            //console.log(`跳过文件夹：${file.name}`);
          } else {
            let filePath = path.join(dir, file.name)
            const subFiles = await this.walkDir(filePath) // 等待子目录的递归调用
            fileArray = fileArray.concat(subFiles)
          }
        } else if (file.isFile() && this.regexForFile.test(file.name)) {
          console.log(`获取到文件：${path.join(dir, file.name)}`)
          let cacheArray = {
            dir: (dir.replace(/\\+/, '/') + '/').replace(/\/+/, '/'),
            name: file.name,
          }
          fileArray.push(cacheArray)
        }
      }
      return fileArray
    } catch (err) {
      console.error(`无法访问目录 ${dir}:`, err)
      throw err
    }
  }
  public reName(e: { dir: string; name: string }) {
    if (fs.existsSync(e.dir + '/uploaded') == false) {
      fs.mkdirSync(e.dir + '/uploaded')
    }
    fs.promises.rename(e.dir + '/' + e.name, e.dir + '/uploaded/' + e.name)
  }
  public await(ms: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`wait for ${ms}ms`)
        resolve(ms)
      }, ms)
    })
  }
}
