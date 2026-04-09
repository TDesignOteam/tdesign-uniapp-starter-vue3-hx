# tdesign-uniapp-tree

基于 Vue 3 + uni-app 的树形选择器组件，API 对齐 [TDesign Vue Next Tree](https://tdesign.tencent.com/vue-next/components/tree)，同时扩展了弹窗模式、拖拽排序等移动端特有能力。配合 `@tdesign/uniapp` 使用。

## 特性

- 🎯 **单选 / 多选** — 默认单选，`checkable` 开启多选
- 🔍 **节点过滤** — 通过 `filter` 函数实时过滤节点
- 🌳 **父子级联** — `checkStrictly` 开启父子关联选中，支持 `weak` / `strong` 模式
- ✅ **受控模式** — 支持 `v-model:value`、`v-model:expanded`、`v-model:actived` 双向绑定
- 📦 **异步加载** — `lazy` + `load` 按需加载子节点
- 🖱 **拖拽排序** — `draggable` 节点拖拽重新排序
- 🎨 **主题定制** — CSS Design Tokens 自定义主题
- 📄 **弹窗 / 页面模式** — `usePopup` 切换 popup 弹窗 / page 整页展示
- 📐 **辅助线** — `line` 开启节点连接线
- 💡 **节点激活** — `activable` 节点高亮激活

## 安装

```bash
npm install tdesign-uniapp-tree @tdesign/uniapp
```

在 `pages.json` 中配置 easycom 自动注册：

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^t-(.*)": "@tdesign/uniapp/$1/$1.vue",
      "tdesign-uniapp-tree": "tdesign-uniapp-tree/tdesign-uniapp-tree/tdesign-uniapp-tree.vue"
    }
  }
}
```

## 快速上手

### 基础单选

```vue
<template>
  <tdesign-uniapp-tree
    ref="treeRef"
    :data="treeData"
    @confirm="onConfirm"
  />
</template>

<script setup>
import { ref } from 'vue';

const treeRef = ref();
const treeData = ref([
  { id: '1', label: '北京' },
  {
    id: '2', label: '上海',
    children: [
      { id: '2-1', label: '浦东新区' },
      { id: '2-2', label: '黄浦区' },
    ],
  },
  {
    id: '3', label: '广州',
    children: [
      { id: '3-1', label: '海珠区' },
      { id: '3-2', label: '番禺区' },
    ],
  },
]);

function onConfirm(list) {
  console.log('选中项：', list);
}
</script>
```

### 多选 + 父子级联

```vue
<tdesign-uniapp-tree
  ref="treeRef"
  :data="treeData"
  checkable
  check-strictly
  value-mode="all"
  @confirm="onConfirm"
/>
```

### 搜索过滤

```vue
<tdesign-uniapp-tree
  ref="treeRef"
  :data="treeData"
  :filter="filterFn"
/>

<script setup>
const keyword = ref('');
function filterFn(node) {
  if (!keyword.value) return true;
  return node.label.includes(keyword.value);
}
</script>
```

### 异步加载

```vue
<tdesign-uniapp-tree
  ref="treeRef"
  :data="asyncTreeData"
  lazy
  :load="loadData"
  checkable
/>

<script setup>
const asyncTreeData = ref([
  { id: 'a1', label: '节点A', children: [] },
  { id: 'b1', label: '节点B', children: [] },
]);

function loadData(data) {
  const { $type: type, source } = data;
  if (type === 'nodeLoad') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: `${source.id}-1`, label: `${source.label}-子项1` },
          { id: `${source.id}-2`, label: `${source.label}-子项2` },
        ]);
      }, 1000);
    });
  }
}
</script>
```

### v-model 受控

```vue
<tdesign-uniapp-tree
  :data="treeData"
  checkable
  v-model:value="checkedIds"
  v-model:expanded="expandedIds"
  v-model:actived="activedIds"
  activable
/>
```

### 页面模式

```vue
<tdesign-uniapp-tree
  :use-popup="false"
  :data="treeData"
  checkable
  @confirm="onConfirm"
/>
```

## API

### Props

#### 对齐 PC 端 TDesign Tree

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 树数据 | `Array` | `[]` |
| keys | 字段别名 `{ value, label, disabled, children }` | `Object` | `{ value: 'id', label: 'label', disabled: 'disabled', children: 'children' }` |
| value / v-model:value | 选中值（受控），支持 `v-model` | `Array` | - |
| defaultValue | 选中值（非受控） | `Array` | `[]` |
| expanded / v-model:expanded | 展开的节点列表（受控） | `Array` | `[]` |
| defaultExpanded | 展开的节点列表（非受控） | `Array` | `[]` |
| actived / v-model:actived | 高亮激活的节点（受控） | `Array` | - |
| defaultActived | 高亮激活的节点（非受控） | `Array` | `[]` |
| activable | 节点是否可高亮激活 | `Boolean` | `false` |
| checkable | 是否显示复选框（多选模式） | `Boolean` | `false` |
| checkStrictly | 父子节点选中状态是否关联 | `Boolean` | `false` |
| disabled | 整棵树是否禁用 | `Boolean` | `false` |
| disableCheck | 禁用复选框。`true` 全部禁用，或 `Function(node)` 按行禁用 | `Boolean / Function` | `false` |
| draggable | 节点是否可拖拽 | `Boolean` | `false` |
| expandAll | 是否展开所有节点 | `Boolean` | `false` |
| expandLevel | 默认展开的层级深度（0 起始） | `Number` | `0` |
| expandMutex | 同级展开互斥（手风琴模式） | `Boolean` | `false` |
| expandOnClickNode | 点击节点时是否展开/折叠 | `Boolean` | `true` |
| expandParent | 展开子节点时自动展开父节点 | `Boolean` | `false` |
| filter | 节点过滤函数 `(node) => boolean` | `Function` | `null` |
| allowFoldNodeOnFilter | 过滤时是否允许折叠节点 | `Boolean` | `false` |
| line | 是否显示节点连接线 | `Boolean` | `false` |
| lazy | 是否延迟加载子节点（需配合 `load`） | `Boolean` | `false` |
| load | 异步加载子节点函数 `(data) => Promise` | `Function` | `null` |
| transition | 展开/折叠是否使用过渡动画 | `Boolean` | `true` |
| valueMode | 选中值模式 | `String` | `'onlyLeaf'` |
| checkProps | 透传给 checkbox 的属性 | `Object` | `{}` |

> `valueMode` 可选值：`'onlyLeaf'`（仅叶子节点）、`'parentFirst'`（父节点优先）、`'all'`（所有节点）

#### UniApp 扩展

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| usePopup | 是否使用弹窗模式 | `Boolean` | `true` |
| title | 弹窗标题，支持函数 `(checked) => string` | `String / Function` | `''` |
| height | 弹窗容器高度（仅 popup 模式，单位 px） | `Number` | `500` |
| editable | 是否可编辑（增删改节点） | `Boolean` | `false` |
| maxChecked | 最大可选数量，0 表示不限制 | `Number` | `0` |
| foldAll | 折叠时是否折叠所有子级 | `Boolean` | `false` |
| border | 是否显示节点分割线 | `Boolean` | `false` |
| checkStrictlyModel | 关联模式：`'weak'` 弱关联 / `'strong'` 强关联 | `String` | `'weak'` |
| showHalfCheckedTips | 是否显示半选状态 | `Boolean` | `true` |
| changeVerify | 选中验证回调 `(current, list) => string \| void` | `Function` | `null` |
| keepAlive | popup 模式是否缓存状态 | `Boolean` | `false` |
| popupProps | 透传给 `t-popup` 的属性 | `Object` | `{}` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击节点时触发 | `({ node, e })` |
| expand | 节点展开/折叠时触发 | `({ node, expanded, e })` |
| active | 节点激活状态变化时触发（需 `activable`） | `(activedIds, { node, e })` |
| change | 选中值变化时触发 | `(checkedList)` |
| confirm | 点击确定按钮时触发 | `(checkedList)` |
| cancel | 取消/关闭弹窗时触发 | `(type: 'masktap' \| 'cancel')` |
| clear | 清空选择时触发 | - |
| load | 异步加载完成时触发 | `({ node })` |
| update:value | `v-model:value` 绑定 | `(values)` |
| update:modelValue | `v-model` 绑定 | `(values)` |
| update:expanded | `v-model:expanded` 绑定 | `(expandedIds)` |
| update:actived | `v-model:actived` 绑定 | `(activedIds)` |
| dragstart | 拖拽开始 | `({ node, e })` |
| dragover | 拖拽悬停在目标节点 | `({ node, e })` |
| dragleave | 拖拽离开目标节点 | `({ node, e })` |
| dragend | 拖拽结束 | `({ node, e })` |
| drop | 拖拽放置完成 | `({ node, target, e })` |

### Slots

| 名称 | 说明 | 作用域参数 |
| --- | --- | --- |
| label | 自定义节点内容 | `{ data }` 当前节点数据 |
| topBar | 滚动区域顶部插槽 | - |
| bottomBar | 滚动区域底部插槽 | - |
| fixedBottomBar | 固定底部插槽（fixed 定位） | - |
| empty | 数据为空时的插槽 | - |
| expandIcon | 展开图标插槽 | - |
| retractIcon | 收起图标插槽 | - |
| lastIcon | 叶子节点图标插槽 | - |

### Methods

通过 `ref` 调用组件实例方法：

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| cShow() | 显示弹窗 | - |
| cHide() | 隐藏弹窗 | - |
| cInitTree() | 重新初始化树 | - |
| getItem(value) | 获取节点信息 | `value: string` |
| getTreeData() | 获取完整树数据（深拷贝） | - |
| setItem(value, options) | 设置节点属性 | `value: string, options: { checked?, expanded?, disabled?, label? }` |
| appendTo(parentValue, data) | 向指定父节点追加子节点 | `parentValue: string, data: Object \| Array` |
| insertBefore(value, data) | 在指定节点前插入节点 | `value: string, data: Object \| Array` |
| insertAfter(value, data) | 在指定节点后插入节点 | `value: string, data: Object \| Array` |
| remove(value) | 删除指定节点 | `value: string` |
| checkedFunc(values, state) | 批量选中/取消节点 | `values: string \| string[], state?: boolean` |
| getCheckedParams() | 获取所有已选中节点的完整数据 | - |

## CSS Design Tokens

组件使用 CSS 变量实现主题定制，覆盖以下变量即可自定义样式：

```css
.tdesign-uniapp-tree {
  --td-tree-bg-color: #fff;
  --td-tree-text-color: #757575;
  --td-tree-brand-color: #0052d9;
  --td-tree-border-color: #f5f5f5;
  --td-tree-line-color: rgba(204, 204, 204, 0.9);
  --td-tree-disabled-color: #ccc;
  --td-tree-input-border-color: #f0f0f0;
  --td-tree-item-height: 80rpx;
  --td-tree-font-size: 28rpx;
  --td-tree-bar-font-size: 32rpx;
  --td-tree-bar-height: 116rpx;
  --td-tree-bar-title-color: #000;
  --td-tree-drag-shadow: 6rpx 8rpx 12rpx rgba(0, 0, 0, 0.15);
  --td-tree-focus-shadow: 0 0 6px 4px rgba(169, 169, 169, 0.15);
  --td-tree-active-color: var(--td-tree-brand-color);
  --td-tree-delete-color: #e34d59;
  --td-tree-empty-color: var(--td-tree-text-color);
  --td-tree-radius: 24rpx;
}
```

## Demo 项目结构

本仓库的 `src/pages/` 即完整的示例项目，采用 `@tdesign/uniapp` 内置的 `t-demo` / `t-demo-header` 组件组织展示。

```
src/pages/
├── index/
│   ├── index.vue                      ← 主入口页（t-demo 模式）
│   └── _example/
│       ├── tree-data.js               ← 公共树数据
│       ├── base/index.vue             ← 基础用法（单选/多选）
│       ├── select-parent/index.vue    ← 父级可选配置
│       ├── echo-default/index.vue     ← 默认回显
│       ├── search-mode/index.vue      ← 搜索过滤
│       ├── expanded/index.vue         ← 展开模式配置
│       ├── draggable/index.vue        ← 拖拽排序
│       ├── async-load/index.vue       ← 异步加载
│       ├── theme/index.vue            ← 主题颜色
│       └── page-mode/index.vue        ← 页面模式入口
└── tree-page/
    └── index.vue                      ← 页面模式示例
```

运行示例：

```bash
# H5
pnpm dev:h5

# 微信小程序
pnpm dev:mp-weixin

# App
pnpm dev:app
```

## 兼容性

- ✅ uni-app / uni-app X
- ✅ Vue 3
- ✅ H5 / 微信小程序 / App

## License

[MIT](./LICENSE)
