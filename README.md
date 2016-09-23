# NFM

[![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]

File manage implement by node.

## Featur

- [ ] 收藏目录
- [ ] 在线编辑器 monaco-editor

## TODO

* 刷新目录, 同步workspace和tree(如果有文件被其他用户删除)
* next
	1. dialog
	2. 文件操作
* 重命名,移动,删除是立刻生效的, 有更好的方案?
* 前端限制上传文件数量, 或者zip包大小
* 回收站
* code review
	1. 除了特殊需要外, 其余fs操作全异步
	2. 注释
* 自定义滚动条
* 浏览器检测
* 优化打包规则 -- shell
* reselect cache?
* normalizr
* key event
* CSS Modules
* 服务端渲染
* To optimize the react
* 是否启用全局日志, 还是手动api日志(目前未添加日志)

  
[travis-image]: https://img.shields.io/travis/keenwon/nfm.svg?style=flat-square
[travis-url]: https://travis-ci.org/keenwon/nfm
[coveralls-image]: https://img.shields.io/coveralls/keenwon/nfm.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/keenwon/nfm?branch=master