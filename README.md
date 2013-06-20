N-Builder
============

## 什么事 N-Builder ?

N-Build 是一个基于nodejs 的 web 工程打包工具。提供了 js, css 压缩打包, png, jpg 图片压缩功能。支持 Windows 和 Linux 两大平台。N-Builder 亦支持多个工程同时打包压缩。使用时只需简单配置 config.js 文件即可。

## 使用说明

### 如何配置 config.js ?

config.js 内含一对象数组, 数组中每个对象对应一个工程（可同时配置多个对象，同时打包多个工程），
每个对象中有 5 个可配置属性，属性如下：

>     rootPath: 需要打包的工程的根目录位置。
>     buildPath: 打包的目标位置。（即需要打包到那个目录）
>     iamges: 图片配置项。
>     js: javascripts 配置项。
>     css: css 配置项。







