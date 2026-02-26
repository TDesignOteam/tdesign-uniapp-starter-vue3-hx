<p align="center">
  <a href="https://tdesign.tencent.com/" target="_blank">
    <img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png">
  </a>
</p>

<p align="center">
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3.x-brightgreen.svg" alt="Vue3" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-latest-purple.svg" alt="Vite" /></a>
  <a href="https://tdesign.tencent.com/uniapp/getting-started"><img src="https://img.shields.io/badge/TDesign-Uniapp-0052d9.svg" alt="TDesign" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License" /></a>
</p>

# TDesign Uniapp Vue3 HBuilderX 示例

基于 Vue 3 + Vite + TDesign Uniapp 的 HBuilderX 示例项目，集成了 [tdesign-uniapp](https://ext.dcloud.net.cn/plugin?name=tdesign-uniapp) 和 [tdesign-uniapp-chat](https://ext.dcloud.net.cn/plugin?name=tdesign-uniapp-chat) 组件库插件。

## ✨ 特性

- 🎨 **TDesign 组件库** - 腾讯出品的企业级设计体系
- 💬 **Chat 组件库** - 内置 tdesign-uniapp-chat 聊天组件
- 📦 **开箱即用** - 完整的项目结构和配置，可直接在 HBuilderX 中运行
- ⚡ **Vite** - 极速的开发体验
- 🌐 **多平台支持** - H5 / 微信 / 支付宝 / 抖音 / QQ / 百度等

## 🔧 功能

本项目的主要作用：

1. 发布 [tdesign-uniapp](https://ext.dcloud.net.cn/plugin?name=tdesign-uniapp) / [tdesign-uniapp-chat](https://ext.dcloud.net.cn/plugin?name=tdesign-uniapp-chat) 插件
2. 作为上述插件的示例项目，一起上传到 DCloud 插件市场
3. 下载、验证插件是否正常
4. 用户查看开箱即用的配置

## 🚀 快速开始

### 初始化

```bash
# 1. 克隆本项目到 tdesign-miniprogram 同级目录
git clone https://github.com/TDesignOteam/tdesign-uniapp-starter-vue3-hx.git

# 2. 在 tdesign-miniprogram 下执行初始化
cd tdesign-miniprogram
npm run uniapp -- run init
```

### 安装依赖

```bash
# 进入项目目录
cd tdesign-uniapp-starter-vue3-hx

# 安装依赖
npm install
```

### 初始化插件

```bash
npm run init
```

> 💡 该命令会同时初始化 tdesign-uniapp 和 tdesign-uniapp-chat 两个插件

## 📦 发布插件

发布插件到 DCloud 插件市场的步骤：

1. `git clone` 本项目到 `tdesign-miniprogram` 同级目录
2. 在 `tdesign-miniprogram` 下执行 `npm run build:uniapp && npm run build:uniapp:chat`
3. 本项目下执行 `npm run init`
4. 在 HBuilderX 中导入本项目
5. 在 `uni_modules/tdesign-uniapp` 目录上右键，点击发布到插件市场，填写表单进行发布

<img src="./docs//image/tdesign-uniapp-plugin-publish-1.png" width="500" />

发布 `tdesign-uniapp-chat` 插件同理，只是目录位置换成了 `uni_modules/tdesign-uniapp-chat`。

### CHANGELOG 注意事项

1. 从 `npm changelog` 中复制
2. 不要用 🐞 🚧 这种图片，否则更新日志完全无法显示
3. 多个标题要换行，即第二个以及后面的 `###`

## 📁 项目结构

```
├── App.vue                 # 根组件
├── main.js                 # 入口文件
├── pages.json              # 页面路由配置
├── manifest.json           # 应用配置
├── uni.scss                # uni-app 全局样式变量
├── vite.config.js          # Vite 配置
├── index.html              # H5 入口
├── static/                 # 静态资源
├── script/                 # 脚本工具
│   ├── publish-tdesign-uniapp/       # tdesign-uniapp 发布脚本
│   └── publish-tdesign-uniapp-chat/  # tdesign-uniapp-chat 发布脚本
├── uni_modules/
│   ├── tdesign-uniapp/               # TDesign 组件库
│   └── tdesign-uniapp-chat/          # TDesign Chat 组件库
└── package.json            # 项目依赖
```

## 🔗 相关链接

- [TDesign Uniapp 组件库](https://tdesign.tencent.com/uniapp/getting-started)
- [TDesign Uniapp 插件市场](https://ext.dcloud.net.cn/plugin?name=tdesign-uniapp)
- [TDesign Uniapp Chat 插件市场](https://ext.dcloud.net.cn/plugin?name=tdesign-uniapp-chat)
- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [Vue 3 文档](https://cn.vuejs.org/)
- [Vite 文档](https://cn.vitejs.dev/)

## 📱 扫码预览

<img src="./docs/image/tdesign-uniapp-starter-vue3-hx-h5.png" width="300" />

## 📄 License

[MIT](LICENSE)
