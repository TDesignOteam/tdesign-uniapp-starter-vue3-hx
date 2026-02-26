# TDesign Uniapp

TDesign Uniapp Vue3 HBuilderX Example.

## 功能

本项目的几个作用

1. 发布 [tdesign-uniapp](https://ext.dcloud.net.cn/plugin?name=tdesign-uniapp)/[tdesign-uniapp-chat](https://ext.dcloud.net.cn/plugin?name=tdesign-uniapp) 插件
2. 作为上述插件的示例项目，一起上传
3. 下载、验证插件是否正常
4. 用户查看开箱即用的配置

## 初始化

本项目初始化流程

1. `git clone` 本项目到 `tdesign-miniprogram` 同级目录
2. 在 `tdesign-miniprogram` 下执行 `npm run uniapp -- run init`

## 发布插件

发布插件步骤

1. `git clone` 本项目到 `tdesign-miniprogram` 同级目录
2. 在 `tdesign-miniprogram` 下执行 `npm run build:uniapp && npm run build:uniapp:chat`
3. 本项目下执行 `npm run init`
4. 在 HBuilderX 中导入本项目
5. 在 `uni_modules/tdesign-uniapp` 目录上右键，点击发布到插件市场，填写表单进行发布

<img src="https://cdn.uwayfly.com/article/2026/2/own_mike_CyhmHS7WiEjG86yy.png" width="500" />

发布 `tdesign-uniapp-chat` 插件同理，只是目录位置换成了 `uni_modules/tdesign-uniapp-chat`。

CHANGELOG 注意事项：

1. 从 `npm changelog` 中复制
2. 不要用 🐞 🚧 这种图片，否则更新日志完全无法显示
3. 多个标题要换行，即第二个以及后面的 `###`
