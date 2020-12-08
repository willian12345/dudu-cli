#!/usr/bin/env node

const program = require('commander')
const ora = require('ora')
const spinner = ora('Loading')
const fs = require('fs')
const path = require('path')
const admZip = require('adm-zip')
const Downloader = require('nodejs-file-downloader')

const zipUrl = 'https://yogo-file-test.oss-cn-hangzhou.aliyuncs.com/home/audio/20201207_733514D16EC44F39A7E5B44FC2F52CFE.zip'
const zipName = 'proejct.zip'
const unzipedDirName = 'vue-multipage-master'
const tempDownloadDir = './.downloads/'

function deleteFolderRecursive(path) {
  if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach(function(file) {
          var curPath = path + "/" + file;
          if(fs.statSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
          } else { // delete file
              fs.unlinkSync(curPath);
          }
      });
      fs.rmdirSync(path);
  }
};
// function rmdir(dir){
  
//   const files = fs.readdirSync(dir)
//   function next(index){
//     console.log(index, files.length)
//     if(index === files.length) {
//       return fs.rmdirSync(dir)
//     }
//     let newPath = path.join(dir, files[index])
//     fs.stat(newPath, (err, stat) => {
//       if(stat.isDirectory()){
//         rmdir(newPath, () => { next(index+1) })
//       }else{
//         fs.unlink(newPath, () => { next(index+1) })
//       }
//     })
//   }
//   next(0)
// }

/**
 * 下载多页应用模板并解压
 */
const downloadTemplate = async function({version, projectName}) {
  spinner.start()
  spinner.color = 'green';

  const downloader = new Downloader({     
    url: zipUrl,     
    directory: tempDownloadDir,
    fileName: zipName,
    onProgress:function(percentage){
      spinner.text = `包下载进度: ${percentage} %`;
    }      
  })

  await downloader.download()

  spinner.succeed()
  spinner.text = `解压包...`;
  spinner.start()
  // 解压 zip 包
  var zip = new admZip(tempDownloadDir + zipName)
  zip.extractAllTo(".", true)
  // 删除下载的临时目录
  deleteFolderRecursive(tempDownloadDir)
  spinner.text = `解压完成`;
  spinner.succeed()
  
  // 修改解压后的项目文件
  editFile({version, projectName})
}

/**
 * 修改 package.json 文件以便修改
 */
 const editFile = function({ version, projectName }) {
  const data = fs.readFileSync(`${process.cwd()}/${unzipedDirName}/package.json`)
  let _data = JSON.parse(data.toString())
  _data.name = projectName
  _data.version = version
  let str = JSON.stringify(_data, null, 4)
  // 写入文件
  fs.writeFileSync(`${process.cwd()}/${unzipedDirName}/package.json`, str)
};

program
  .version('0.0.1', '-v, --version')

// 初始化命令
program
  .command('init <name> [otherOption...]')
  .action((name, otherOption) => {
    console.log('开始创建%s', name)
    downloadTemplate({version: '0.0.1', projectName: name})
  });

program.parse(process.argv)

