#!/usr/bin/env node

const program = require('commander')
const inquirer = require('inquirer');
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


const questions = [
  {
    type: 'input',
    name: 'name',
    message: '项目名称',
    default: 'helloworld'
  },
  {
    type: 'input',
    name: 'version',
    message: '版本',
    default: '1.0.0'
  },
  {
    type: 'input',
    name: 'description',
    message: '项目描述',
    default: ''
  },
  {
    type: 'input',
    name: 'author',
    message: '作者',
    default: 'alien'
  }
]


function deleteFolderRecursive(path) {
  if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach(function(file) {
          var curPath = path + "/" + file;
          if(fs.statSync(curPath).isDirectory()) {
              deleteFolderRecursive(curPath);
          } else { // delete file
              fs.unlinkSync(curPath);
          }
      });
      fs.rmdirSync(path);
  }
};


/**
 * 下载多页应用模板并解压
 */
const downloadTemplate = async function(answers) {
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

  // 如果已存在项目名相同的文件夹，则删除
  if(fs.existsSync('./' + answers.name)){
    deleteFolderRecursive('./' + answers.name)
  }
  // 重命令 'vue-multipage-master' 为用户输入的 name
  fs.renameSync(unzipedDirName, './' + answers.name)
  // 删除下载的临时目录
  deleteFolderRecursive(tempDownloadDir)
  spinner.text = `解压完成`
  spinner.succeed()
  // 修改解压后的项目文件
  editFile(answers)
}

/**
 * 修改 package.json 文件以便修改
 */
 const editFile = function({ version, name, author, description }) {
  const data = fs.readFileSync(`${process.cwd()}/${name}/package.json`)
  let _data = JSON.parse(data.toString())
  _data.name = name
  _data.version = version
  _data.author = author
  _data.description = description
  let str = JSON.stringify(_data, null, 4)
  // 写入文件
  fs.writeFileSync(`${process.cwd()}/${name}/package.json`, str)
};

// 接受命令行输入
program
  .version('v0.0.1', '-v, --version')
  .command('init')
  .action( async () => {
    const answers = await inquirer.prompt(questions);
    downloadTemplate(answers)
  });

program.parse(process.argv)

