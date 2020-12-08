## dudu-cli
命令行工具创建 vue 多页应用

vue multipage 区别于 spa 项目

```
$ npm install dudu-cli -g
$ dudu-cli -v
dudu-cli version 0.0.1
```

安装并启动 helloworld 新项目
```
$ dudu-cli init
$ cd helloworld
$ yarn
$ yarn serve
```


多页中使用各常用组件demo
- createjs 使用 createjs 库 

- fullpage 使用 fullpage 库

- index 默认页

- jsx 使用 jsx 语法

- normal 普通页面

- spa 多页中的单页应用

- video 使用腾讯视频播放器

- virtual-scroll 使用虚拟滚动列表

######也可自行去github手动下载模板修改
[项目模板 github](https://github.com/willian12345/vue-multipage)


### 如何新增页面
######类似微信小程序增加新页面，增加页面后需要重启
项目
- pages目录下新建目录如: test
- test 目录内增加 main.js 文件
```
  import Vue from 'vue'
  import '@/assets/style/main.scss';
  import app from './main.vue'
  
  new Vue({
    el: '#app',
    template: '<app/>',
    components: { app }
  })
```
- test 目录内增加 main.vue 文件，即为主要的 vue 入口文件
```
  <template>
    <div>hello test</div>
  </template>
  <script>
    export default {
      name: 'test',
      data () {
        return {

        }
      },
      created () {
        
      }
    }
  </script>
```