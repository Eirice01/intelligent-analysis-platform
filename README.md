# 大数据智能分析平台

### 启动 🔥

```js
yarn install

yarn start
```

###  项目结构

```
├─mocks                           // mock 数据目录
├─project-scripts                 // 工程脚本目录
├─public                          // index.html 模板目录
└─src                             // 开发目录
    ├─assets                      // 静态资源目录
    │  ├─font
    │  └─images
    ├─commons                     // 公共工具
    |  └─interception.js
    ├─components                  // 公共组件库
    │  ├─chart
    │  ├─header
    │  └─map
    ├─containers                  // 布局层
    │  └─app
    ├─modules                     // 业务模块层(根据业务划分模块)
    │  ├─ability-analysis         // 能力分析
    │  ├─basic-info               // 基础信息
    │  ├─combat-readiness         // 战备状态
    │  ├─entry-information        // 信息录入
    │  ├─training                 // 训练信息
    │  ├─training                 // 人员信息
    │  ├─home                     // 系统首页[样式命名根据业务命名 - 避免样式冲突]
    │  │  ├─views                 // 首页视图
    │  │  │  ├─person-card.js     // 人员信息 - 根据功能命名组件[避免业务改变引起文件名不匹配]
    │  │  │  ├─pie-group-card.js  // 装备状态
    │  │  │  ├─radar-card.js      // 能力分析
    │  │  │  ├─summary-card.js    // 旅信息
    │  │  │  └─training-card.js   // 训练状态
    │  │  ├─home.service.js       // 首页模块 service
    │  │  ├─index.js              // 首页模块入口
    │  │  ├─index.less            // 首页模块样式
    │  │  └─home.store.js         // 首页模块数据
    ├─index.js                    // 单页应用入口
    ├─index.less                  // 单页应用入口样式文件
    └─service-worker.js           // mock server 拦截器

```

### 项目依赖

-   [react](https://facebook.github.io/react/)
-   [react-dom](<span style="color: rgb(243,121,52);">React package for working with the DOM</span>)
-   [react-router-dom](<span style="color: rgb(243,121,52);">DOM binding for React Router</span>)
-   [mobx](<span style="color: rgb(243,121,52);">状态管理工具</span>)
-   [mobx-react](<span style="color: rgb(243,121,52);">React 和 Mobx 桥梁</span>)
-   [antd](<span style="color: rgb(243,121,52);">蚂蚁金服开源的 react ui 组件框架</span>)
-   [v-block.lite](<span style="color: rgb(243,121,52);">基于 Flexbox 的布局组件</span>)
-   [axios](<span style="color: rgb(243,121,52);">http 请求模块，可用于前端任何场景，很强大 👍</span>)
-   [echarts](<span style="color: rgb(243,121,52);">Echarts 图表库</span>)
-   [echarts-liquidfill](<span style="color: rgb(243,121,52);">ECharts liquid fill extension</span>)
-   [echarts-for-react](<span style="color: rgb(243,121,52);">Baidu Echarts(v3.x & v4.x) components for react.</span>)
-   [swiper](<span style="color: rgb(243,121,52);">swiper 轮播图</span>)
-   [react-id-swiper](<span style="color: rgb(243,121,52);">swiper Components for react</span>)
-   [react-mapbox-gl](<span style="color: rgb(243,121,52);">A WebGL interactive maps library</span>)

-   其他小细节省略
