<template>
  <view class="tdesign-uniapp-tree">
    <!-- ===== popup 模式：使用 t-popup ===== -->
    <t-popup
      v-if="isPopupMode"
      :visible="showTree"
      placement="bottom"
      v-bind="mergedPopupProps"
      @visible-change="onPopupVisibleChange"
    >
      <view
        class="tdesign-uniapp-tree-cnt tdesign-uniapp-tree-cnt-popup"
        :style="{ height: height + 'px' }"
        @touchmove.stop.prevent="onTouchMove"
        @touchend="onTouchEnd"
      >
        <!-- 顶部工具栏 -->
        <view class="tdesign-uniapp-tree-bar">
          <view class="tdesign-uniapp-tree-bar-left">
            <view class="tdesign-uniapp-tree-bar-cancel" hover-class="hover-c" @tap="handleCancel('cancel')">
              取消
            </view>
          </view>
          <view class="tdesign-uniapp-tree-bar-title">{{ computedTitle }}</view>
          <view class="tdesign-uniapp-tree-bar-right">
            <view
              v-if="editable"
              class="tdesign-uniapp-tree-bar-action"
              hover-class="hover-c"
              @tap="handleRevert"
            >
              还原
            </view>
            <view class="tdesign-uniapp-tree-bar-confirm" hover-class="hover-c" @tap="handleConfirm">
              确定
            </view>
          </view>
        </view>

        <!-- 树视图区域 -->
        <view class="tdesign-uniapp-tree-view">
        <!-- 顶部插槽 -->
        <view id="topBarContainer">
          <slot name="topBar" />
        </view>

        <!-- 滚动列表 -->
        <scroll-view class="tdesign-uniapp-tree-view-sc" :scroll-y="true" :scroll-top="scrollTop" @scroll="scrollCallback">
          <view v-if="computedTreeList.length">
            <block v-for="(item, index) in computedTreeList" :key="index">
              <view class="tdesign-uniapp-tree-item-block">
                <view
                  class="tdesign-uniapp-tree-item"
                  :style="[{ paddingLeft: item.rank * 15 + 'px', zIndex: item.rank * -1 + 50 }]"
                  :class="{
                    border: border === true,
                    show: item.show,
                    last: item.lastRank,
                    showchild: item.showChild,
                    open: item.open,
                    disabled: item.disabled === true,
                    active: activable && innerActived.indexOf(item.id) !== -1,
                    focus: getShowFocusItemLine(item),
                    'no-transition': !transition,
                  }"
                  @touchmove="treeItemfocus"
                >
                  <!-- 辅助线 -->
                  <block v-if="line">
                    <template v-if="item.rank > 1">
                      <view
                        v-for="i in item.rank - 1"
                        :key="i"
                        :style="{ left: 6 * (2 * i - 1) + 3 * (i - 1) + 'px' }"
                        class="parent-horizontal-line"
                      />
                    </template>
                    <view class="left-line">
                      <view v-if="item.lastRank && item.rank" class="horizontal-line" />
                    </view>
                  </block>

                  <!-- 节点标签区域 -->
                  <view class="tdesign-uniapp-tree-label" @tap.stop.prevent="handleTreeItemTap(item, index)">
                    <view v-if="line && item.lastRank && item.rank" class="horizontal-line-box" />

                    <!-- 图标: 插槽或默认 -->
                    <template v-if="$slots.lastIcon && item.lastRank">
                      <slot name="lastIcon" />
                    </template>
                    <template v-else-if="$slots.expandIcon && !item.lastRank && item.showChild">
                      <slot name="expandIcon" />
                    </template>
                    <template v-else-if="$slots.retractIcon && !item.lastRank && !item.showChild">
                      <slot name="retractIcon" />
                    </template>
                    <t-icon
                      v-else-if="item.lastRank"
                      name="file"
                      size="32rpx"
                      style="margin-right: 8rpx"
                      class="tdesign-uniapp-tree-node-icon"
                    />
                    <t-icon
                      v-else-if="item.showChild"
                      name="caret-down-small"
                      size="32rpx"
                      style="margin-right: 8rpx"
                      class="tdesign-uniapp-tree-node-icon"
                    />
                    <t-icon
                      v-else
                      name="caret-right-small"
                      size="32rpx"
                      style="margin-right: 8rpx"
                      class="tdesign-uniapp-tree-node-icon"
                    />

                    <!-- 拖拽手柄 -->
                    <view v-if="draggable" class="drag-box" @touchstart.stop.prevent="onTouchStartItem($event, item)">
                      <t-icon name="move" size="40rpx" />
                    </view>

                    <!-- 编辑模式输入框 -->
                    <input
                      v-if="editable && item.status === 'edit'"
                      v-model="item.name"
                      class="label-input"
                      placeholder="请输入"
                      @tap.stop
                    />
                    <!-- 自定义标签插槽 -->
                    <slot v-else-if="$slots.label" name="label" :data="getLabelSlotData(item)" />
                    <!-- 选中态高亮 -->
                    <text v-else-if="item.checked && !item.disabled" class="tdesign-uniapp-tree-text-active">{{ item.name }}</text>
                    <!-- 默认文本 -->
                    <text v-else>{{ item.name }}</text>
                  </view>

                  <!-- 选择区域：使用 t-checkbox -->
                  <template v-if="isSelectMode">
                    <view
                      v-if="canCheckNode(item)"
                      class="tdesign-uniapp-tree-check"
                      @tap.stop
                    >
                      <t-checkbox
                        :checked="item.checked"
                        :disabled="item.disabled || isDisableCheck(item)"
                        :indeterminate="showHalfCheckedTips && showHalfChecked(item)"
                        v-bind="mergedCheckProps"
                        :icon="computedCheckboxIcon"
                        content-disabled
                        @change="handleTreeItemSelect(item, index)"
                      />
                    </view>
                  </template>

                  <!-- 编辑模式操作 -->
                  <template v-else-if="editable">
                    <t-loading v-if="item.status === 'loading'" size="32rpx" />
                    <view v-else class="edit-actions">
                      <t-icon
                        v-if="item.status === 'edit'"
                        name="check"
                        size="36rpx"
                        @click="handleComplete(item)"
                      />
                      <template v-else>
                        <t-icon name="edit" size="36rpx" @click="handleEditItem(item)" />
                        <t-icon name="add-rectangle" size="36rpx" style="margin-left: 16rpx" @click="handleAddSubItem(item)" />
                        <t-icon name="add" size="36rpx" style="margin-left: 16rpx" @click="handleAddSameItem(item)" />
                      </template>
                      <t-icon name="delete" size="36rpx" class="tdesign-uniapp-tree-delete-icon" style="margin-left: 16rpx" @click="handleDelItem(item)" />
                    </view>
                  </template>

                  <!-- 拖拽焦点线 -->
                  <view
                    v-if="getShowFocusItemLine(item)"
                    :style="{
                      width: 'calc(100% - ' + (6 * (2 * item.rank - 1) + 3 * (item.rank - 1) - 1) + 'px)',
                    }"
                    class="focus-item-line"
                  />
                </view>
              </view>
            </block>
          </view>
          <view v-else>
            <slot v-if="$slots.empty" name="empty" />
            <view v-else class="empty"><text>暂无数据</text></view>
          </view>
          <slot name="bottomBar" />
        </scroll-view>
      </view>

      <!-- 底部固定栏 (popup 内) -->
      <view id="fixedBottomBarContainer" class="fixed-bottom-bar-popup">
        <slot name="fixedBottomBar" :checked="getCheckedParams()" :clear="handleClear">
          <view v-if="isSelectMode" class="tdesign-uniapp-tree-footer">
            <text class="tdesign-uniapp-tree-footer-info">已选 {{ checkedCount }} 项</text>
            <text class="tdesign-uniapp-tree-footer-clear" hover-class="hover-c" @tap="handleClear">清空</text>
          </view>
        </slot>
      </view>
      </view>
    </t-popup>

    <!-- ===== page 模式：直接渲染 ===== -->
    <view
      v-else
      class="tdesign-uniapp-tree-cnt tdesign-uniapp-tree-cnt-page"
      @touchmove.stop.prevent="onTouchMove"
      @touchend="onTouchEnd"
    >
      <!-- 树视图区域 -->
      <view class="tdesign-uniapp-tree-view" style="top: 0rpx">
        <!-- 顶部插槽 -->
        <view id="topBarContainer">
          <slot name="topBar" />
        </view>

        <!-- 滚动列表 -->
        <scroll-view class="tdesign-uniapp-tree-view-sc" :scroll-y="true" :scroll-top="scrollTop" @scroll="scrollCallback">
          <view v-if="computedTreeList.length">
            <block v-for="(item, index) in computedTreeList" :key="index">
              <view class="tdesign-uniapp-tree-item-block">
                <view
                  class="tdesign-uniapp-tree-item"
                  :style="[{ paddingLeft: item.rank * 15 + 'px', zIndex: item.rank * -1 + 50 }]"
                  :class="{
                    border: border === true,
                    show: item.show,
                    last: item.lastRank,
                    showchild: item.showChild,
                    open: item.open,
                    disabled: item.disabled === true,
                    active: activable && innerActived.indexOf(item.id) !== -1,
                    focus: getShowFocusItemLine(item),
                    'no-transition': !transition,
                  }"
                  @touchmove="treeItemfocus"
                >
                  <!-- 辅助线 -->
                  <block v-if="line">
                    <template v-if="item.rank > 1">
                      <view
                        v-for="i in item.rank - 1"
                        :key="i"
                        :style="{ left: 6 * (2 * i - 1) + 3 * (i - 1) + 'px' }"
                        class="parent-horizontal-line"
                      />
                    </template>
                    <view class="left-line">
                      <view v-if="item.lastRank && item.rank" class="horizontal-line" />
                    </view>
                  </block>

                  <!-- 节点标签区域 -->
                  <view class="tdesign-uniapp-tree-label" @tap.stop.prevent="handleTreeItemTap(item, index)">
                    <view v-if="line && item.lastRank && item.rank" class="horizontal-line-box" />

                    <!-- 图标 -->
                    <template v-if="$slots.lastIcon && item.lastRank">
                      <slot name="lastIcon" />
                    </template>
                    <template v-else-if="$slots.expandIcon && !item.lastRank && item.showChild">
                      <slot name="expandIcon" />
                    </template>
                    <template v-else-if="$slots.retractIcon && !item.lastRank && !item.showChild">
                      <slot name="retractIcon" />
                    </template>
                    <t-icon v-else-if="item.lastRank" name="file" size="32rpx" style="margin-right: 8rpx" class="tdesign-uniapp-tree-node-icon" />
                    <t-icon v-else-if="item.showChild" name="caret-down-small" size="32rpx" style="margin-right: 8rpx" class="tdesign-uniapp-tree-node-icon" />
                    <t-icon v-else name="caret-right-small" size="32rpx" style="margin-right: 8rpx" class="tdesign-uniapp-tree-node-icon" />

                    <!-- 拖拽手柄 -->
                    <view v-if="draggable" class="drag-box" @touchstart.stop.prevent="onTouchStartItem($event, item)">
                      <t-icon name="move" size="40rpx" />
                    </view>

                    <!-- 编辑模式输入框 -->
                    <input v-if="editable && item.status === 'edit'" v-model="item.name" class="label-input" placeholder="请输入" @tap.stop />
                    <!-- 自定义标签插槽 -->
                    <slot v-else-if="$slots.label" name="label" :data="getLabelSlotData(item)" />
                    <!-- 选中态高亮 -->
                    <text v-else-if="item.checked && !item.disabled" class="tdesign-uniapp-tree-text-active">{{ item.name }}</text>
                    <!-- 默认文本 -->
                    <text v-else>{{ item.name }}</text>
                  </view>

                  <!-- 选择区域：使用 t-checkbox -->
                  <template v-if="isSelectMode">
                    <view v-if="canCheckNode(item)" class="tdesign-uniapp-tree-check" @tap.stop>
                      <t-checkbox
                        :checked="item.checked"
                        :disabled="item.disabled || isDisableCheck(item)"
                        :indeterminate="showHalfCheckedTips && showHalfChecked(item)"
                        v-bind="mergedCheckProps"
                        :icon="computedCheckboxIcon"
                        content-disabled
                        @change="handleTreeItemSelect(item, index)"
                      />
                    </view>
                  </template>

                  <!-- 编辑模式操作 -->
                  <template v-else-if="editable">
                    <t-loading v-if="item.status === 'loading'" size="32rpx" />
                    <view v-else class="edit-actions">
                      <t-icon v-if="item.status === 'edit'" name="check" size="36rpx" @click="handleComplete(item)" />
                      <template v-else>
                        <t-icon name="edit" size="36rpx" @click="handleEditItem(item)" />
                        <t-icon name="add-rectangle" size="36rpx" style="margin-left: 16rpx" @click="handleAddSubItem(item)" />
                        <t-icon name="add" size="36rpx" style="margin-left: 16rpx" @click="handleAddSameItem(item)" />
                      </template>
                      <t-icon name="delete" size="36rpx" class="tdesign-uniapp-tree-delete-icon" style="margin-left: 16rpx" @click="handleDelItem(item)" />
                    </view>
                  </template>

                  <!-- 拖拽焦点线 -->
                  <view
                    v-if="getShowFocusItemLine(item)"
                    :style="{ width: 'calc(100% - ' + (6 * (2 * item.rank - 1) + 3 * (item.rank - 1) - 1) + 'px)' }"
                    class="focus-item-line"
                  />
                </view>
              </view>
            </block>
          </view>
          <view v-else>
            <slot v-if="$slots.empty" name="empty" />
            <view v-else class="empty"><text>暂无数据</text></view>
          </view>
          <slot name="bottomBar" />
        </scroll-view>
      </view>
    </view>

    <!-- 底部固定栏 (page 模式) -->
    <view v-if="!isPopupMode" id="fixedBottomBarContainer" class="fixed-bottom-bar">
      <slot name="fixedBottomBar" :checked="getCheckedParams()" :clear="handleClear">
        <view v-if="isSelectMode" class="tdesign-uniapp-tree-footer">
          <text class="tdesign-uniapp-tree-footer-info">已选 {{ checkedCount }} 项</text>
          <text class="tdesign-uniapp-tree-footer-clear" hover-class="hover-c" @tap="handleClear">清空</text>
        </view>
      </slot>
    </view>

    <!-- 拖拽浮层 -->
    <view v-if="dragItem.isDragging" :style="draggingStyle" class="drag-container-view">
      <template v-if="$slots.lastIcon && dragItem.data.lastRank">
        <slot name="lastIcon" />
      </template>
      <template v-else-if="$slots.expandIcon && !dragItem.data.lastRank && dragItem.data.showChild">
        <slot name="expandIcon" />
      </template>
      <template v-else-if="$slots.retractIcon && !dragItem.data.lastRank && !dragItem.data.showChild">
        <slot name="retractIcon" />
      </template>
      <t-icon v-else-if="dragItem.data.lastRank" name="file" size="32rpx" style="margin-right: 8rpx" class="tdesign-uniapp-tree-node-icon" />
      <t-icon v-else-if="dragItem.data.showChild" name="caret-down-small" size="32rpx" style="margin-right: 8rpx" class="tdesign-uniapp-tree-node-icon" />
      <t-icon v-else name="caret-right-small" size="32rpx" style="margin-right: 8rpx" class="tdesign-uniapp-tree-node-icon" />
      <slot v-if="$slots.label" name="label" :data="getLabelSlotData(dragItem.data)" />
      <text v-else-if="dragItem.data.checked && !dragItem.data.disabled" class="tdesign-uniapp-tree-text-active">{{ dragItem.data.name }}</text>
      <text v-else>{{ dragItem.data.name }}</text>
    </view>
  </view>
</template>

<script>
import { throttle, compareJsonArrays } from "./libs/util";

export default {
  name: "TdesignUniappTree",
  emits: [
    "cancel", "confirm", "change", "clear", "click", "expand", "active", "load",
    "update:value", "update:modelValue", "update:actived", "update:expanded",
    "dragstart", "dragend", "dragleave", "dragover", "drop",
  ],
  props: {
    // ==================== 对齐 PC 端 API ====================
    /** 是否使用弹窗模式（替代原 uiMode） */
    usePopup: { type: Boolean, default: true },
    /** 树数据 */
    data: { type: Array, default: function () { return []; } },
    /** 字段别名 { value, label, disabled, children } */
    keys: {
      type: Object,
      default: function () {
        return { value: "id", label: "label", disabled: "disabled", children: "children" };
      },
    },
    /** 是否显示复选框（多选模式） */
    checkable: { type: Boolean, default: false },
    /** 父子节点不关联选中 */
    checkStrictly: { type: Boolean, default: false },
    /** 整棵树禁用 */
    disabled: { type: Boolean, default: false },
    /** 禁用复选框。支持 boolean 禁用全部，或 Function(node) 按行禁用 */
    disableCheck: { type: [Boolean, Function], default: false },
    /** 节点可拖拽 */
    draggable: { type: Boolean, default: false },
    /** 选中值（受控 v-model） */
    value: { type: Array, default: null },
    modelValue: { type: Array, default: null },
    /** 选中值（非受控） */
    defaultValue: { type: Array, default: function () { return []; } },
    /** 展开的节点（受控），对齐 PC 端 expanded */
    expanded: { type: Array, default: function () { return []; } },
    /** 展开的节点（非受控） */
    defaultExpanded: { type: Array, default: function () { return []; } },
    /** 是否展开全部节点 */
    expandAll: { type: Boolean, default: false },
    /** 默认展开的层级，从 0 开始 */
    expandLevel: { type: Number, default: 0 },
    /** 同级展开互斥（手风琴模式） */
    expandMutex: { type: Boolean, default: false },
    /** 点击节点时是否展开/折叠 */
    expandOnClickNode: { type: Boolean, default: true },
    /** 展开子节点时，是否自动展开父节点 */
    expandParent: { type: Boolean, default: false },
    /** 节点过滤函数。(node: Object) => boolean，返回 true 表示显示该节点 */
    filter: { type: Function, default: null },
    /** 节点连接线 */
    line: { type: Boolean, default: false },
    /** 异步加载子节点函数 */
    load: { type: Function, default: null },
    /** 节点延迟加载（需配合 load 使用） */
    lazy: { type: Boolean, default: false },
    /** 节点是否可高亮激活 */
    activable: { type: Boolean, default: false },
    /** 高亮激活的节点（受控） */
    actived: { type: Array, default: null },
    /** 高亮激活的节点（非受控） */
    defaultActived: { type: Array, default: function () { return []; } },
    /** 过滤时是否允许折叠节点 */
    allowFoldNodeOnFilter: { type: Boolean, default: false },
    /** 展开/折叠过渡动画 */
    transition: { type: Boolean, default: true },
    /** 选中值模式：onlyLeaf 仅叶子可选 / parentFirst 父优先 / all 所有节点可选 */
    valueMode: { type: String, default: "onlyLeaf" },
    /** 透传 checkbox 属性 */
    checkProps: { type: Object, default: function () { return {}; } },
    /** 树的高度（popup 模式生效） */
    height: { type: Number, default: 500 },

    // ==================== UniApp 扩展 ====================
    /** 是否可编辑（增删改节点） */
    editable: { type: Boolean, default: false },
    /** 最大可选数量，0 表示不限制 */
    maxChecked: { type: Number, default: 0 },
    /** 折叠时是否折叠所有子级 */
    foldAll: { type: Boolean, default: false },
    /** 显示边框线 */
    border: { type: Boolean, default: false },
    /** 父子关联策略 weak / strong */
    checkStrictlyModel: { type: String, default: "weak" },
    /** 是否显示半选状态 */
    showHalfCheckedTips: { type: Boolean, default: true },
    /** popup 模式弹窗标题 */
    title: { type: [String, Function], default: "" },
    /** 选中验证回调 */
    changeVerify: { type: Function, default: null },
    /** popup 模式缓存 */
    keepAlive: { type: Boolean, default: false },
    /** popup 透传属性 */
    popupProps: { type: Object, default: function () { return {}; } },
  },
  data: function () {
    return {
      showTree: false,
      treeList: [],
      currentTreeData: [],
      nodeInitContrl: {},
      top: "",
      scrollTop: 0,
      initNum: 1,
      windowHeight: 0,
      timer: 0,
      throttleFunc: null,
      // 内部展开列表（合并 expanded 和 defaultExpanded）
      innerExpanded: [],
      // 内部激活列表（合并 actived 和 defaultActived）
      innerActived: [],
      dragItem: {
        isDragging: false,
        currentY: 0,
        data: {},
        focusTreeItemId: "",
      },
    };
  },
  computed: {
    // ===== 字段别名 =====
    innerValueKey: function () { return this.keys.value || "id"; },
    innerLabelKey: function () { return this.keys.label || "label"; },
    innerDisabledKey: function () { return this.keys.disabled || "disabled"; },
    innerChildrenKey: function () { return this.keys.children || "children"; },

    isSelectMode: function () { return !this.editable; },
    isMultiple: function () { return this.checkable; },
    computedCheckboxIcon: function () {
      if (this.mergedCheckProps.icon) return this.mergedCheckProps.icon;
      return this.checkable ? "rectangle" : "circle";
    },
    mergedCheckProps: function () {
      return Object.assign({}, this.checkProps);
    },

    innerValue: function () {
      if (this.modelValue !== null) return this.modelValue;
      if (this.value !== null) return this.value;
      return null;
    },

    isPopupMode: function () { return this.usePopup; },
    mergedPopupProps: function () { return Object.assign({}, this.popupProps); },
    computedTitle: function () {
      if (typeof this.title === "function") {
        return this.title(this.getCheckedParams());
      }
      return this.title;
    },
    draggingStyle: function () {
      return {
        position: "fixed",
        zIndex: 999,
        left: 0,
        top: this.dragItem.currentY + 20 + "px",
      };
    },

    // 计算初始展开列表：合并 expanded prop、defaultExpanded、expandAll、expandLevel
    resolvedExpanded: function () {
      // 如果 expandAll，收集所有非叶子节点 id
      if (this.expandAll) {
        return this._collectAllParentIds(this.data);
      }
      // 如果有 expanded prop（受控），优先使用
      if (this.expanded && this.expanded.length) {
        var result = this.expanded.slice();
        // expandParent：自动补齐父链
        if (this.expandParent) {
          result = this._ensureParentExpanded(result);
        }
        return result;
      }
      // 非受控 defaultExpanded
      if (this.defaultExpanded && this.defaultExpanded.length) {
        var result2 = this.defaultExpanded.slice();
        if (this.expandParent) {
          result2 = this._ensureParentExpanded(result2);
        }
        return result2;
      }
      // expandLevel
      if (this.expandLevel > 0) {
        return this._collectIdsByLevel(this.data, this.expandLevel);
      }
      return [];
    },

    // 已选中项数量
    checkedCount: function () {
      var self = this;
      var count = 0;
      self.treeList.forEach(function (item) {
        if (item.checked) count++;
      });
      return count;
    },

    computedTreeList: function () {
      var self = this;
      if (self.filter) {
        return self.treeList
          .filter(function (item) {
            return self.filter(item.source);
          })
          .map(function (item) {
            var o = JSON.parse(JSON.stringify(item));
            if (!self.allowFoldNodeOnFilter) {
              if (!o.showChild) o.showChild = true;
              if (!o.show) o.show = true;
            }
            return o;
          });
      }
      return self.treeList;
    },

    // 计算激活列表
    resolvedActived: function () {
      if (this.actived !== null && Array.isArray(this.actived)) return this.actived;
      return this.defaultActived || [];
    },
  },
  watch: {
    showTree: function (bool) {
      if (this.usePopup) {
        this._watchShowTreePopup(bool);
      }
    },
    data: {
      handler: function () {
        if (!this.usePopup) {
          var self = this;
          self.treeList.length = 0;
          self.nodeInitContrl = {};
          self.$nextTick(function () {
            self.cInitTree();
          });
        }
      },
      deep: true,
    },
    innerValue: {
      handler: function (newVal) {
        if (newVal !== null && Array.isArray(newVal)) {
          this._syncValueToChecked(newVal);
        }
      },
      deep: true,
    },
    expanded: {
      handler: function () {
        // expanded 受控变化时重新初始化
        this.innerExpanded = this.resolvedExpanded;
      },
      deep: true,
    },
    actived: {
      handler: function (newVal) {
        if (newVal !== null && Array.isArray(newVal)) {
          this.innerActived = newVal;
        }
      },
      deep: true,
    },
    filter: function () {
      // filter 变化时触发重新计算
    },
  },
  mounted: function () {
    this.innerExpanded = this.resolvedExpanded;
    this.innerActived = this.resolvedActived;
    this.uiModeInit(this.keepAlive);

    var self = this;
    var bottomBarSlotH = 0;
    var topBarSlotH = 0;

    self.$nextTick(function () {
      var query = uni.createSelectorQuery().in(self);
      query
        .select("#fixedBottomBarContainer")
        .boundingClientRect(function (rect) {
          bottomBarSlotH = rect ? rect.height || 0 : 0;
        })
        .exec();
      query
        .select("#topBarContainer")
        .boundingClientRect(function (rect) {
          topBarSlotH = rect ? rect.height || 0 : 0;
        })
        .exec();
    });

    self.throttleFunc = throttle(function (e) {
      var topBarH = 36;
      var step = 30;
      var touch = e.touches[0];
      var facusH = 60;
      if (!touch) return;
      if (self.usePopup) {
        if (self.windowHeight - touch.clientY < facusH + bottomBarSlotH) {
          self.scrollTop = self.scrollTop + step;
        } else if (self.scrollTop > 0) {
          var threshold = self.windowHeight - self.height + topBarH + topBarSlotH;
          if (touch.clientY < threshold) {
            self.scrollTop = Math.max(0, self.scrollTop - step);
          }
        }
      } else {
        if (self.windowHeight - touch.clientY < facusH + bottomBarSlotH) {
          self.scrollTop = self.scrollTop + step;
        } else if (self.scrollTop > 0) {
          var threshold2 = topBarSlotH;
          if (touch.clientY < threshold2) {
            self.scrollTop = Math.max(0, self.scrollTop - step);
          }
        }
      }
    }, 10);
  },
  methods: {
    // ==================== Public API ====================
    /** 显示弹窗 */
    cShow: function () { this.showTree = true; },
    /** 隐藏弹窗 */
    cHide: function () { this.showTree = false; },

    /** 初始化树 */
    cInitTree: function () {
      this.treeList.length = 0;
      this.innerExpanded = this.resolvedExpanded;
      if (this.load) {
        this.currentTreeData = JSON.parse(JSON.stringify(this.data));
      } else {
        this.currentTreeData = this.data;
      }
      this.cRenderTreeList(this.currentTreeData);
      var self = this;
      self.$nextTick(function () {
        self.cDefaultSelect();
        if (self.innerValue !== null && Array.isArray(self.innerValue)) {
          self._syncValueToChecked(self.innerValue);
        }
      });
    },

    /** 获取节点信息 */
    getItem: function (value) {
      var self = this;
      var treeItem = self.treeList.find(function (it) { return it.id === value; });
      if (!treeItem) return null;
      var sourceItem = self.getItemFromTreeData(self.currentTreeData, value);
      return {
        node: sourceItem,
        data: treeItem.source,
        value: treeItem.id,
        label: treeItem.name,
        checked: treeItem.checked,
        expanded: treeItem.showChild,
        disabled: treeItem.disabled,
        isLeaf: treeItem.lastRank,
        parents: treeItem.parents,
        level: treeItem.rank,
      };
    },

    /** 获取完整树数据 */
    getTreeData: function () {
      return JSON.parse(JSON.stringify(this.currentTreeData));
    },

    /** 删除指定节点 */
    remove: function (value) {
      var item = this.treeList.find(function (it) { return it.id === value; });
      if (item) {
        this.delItemFunc(item);
        // 同步到 currentTreeData
        this._removeFromTreeData(this.currentTreeData, value);
      }
    },

    /** 设置节点属性 */
    setItem: function (value, options) {
      var self = this;
      var item = self.treeList.find(function (it) { return it.id === value; });
      if (!item) return;
      if (options.hasOwnProperty("checked")) {
        item.checked = !!options.checked;
      }
      if (options.hasOwnProperty("expanded")) {
        item.showChild = !!options.expanded;
        item.open = !!options.expanded;
      }
      if (options.hasOwnProperty("disabled")) {
        item.disabled = !!options.disabled;
      }
      if (options.hasOwnProperty("label")) {
        item.name = options.label;
      }
      // 同步到 source
      var sourceItem = self.getItemFromTreeData(self.currentTreeData, value);
      if (sourceItem) {
        if (options.hasOwnProperty("label")) sourceItem[self.innerLabelKey] = options.label;
        if (options.hasOwnProperty("disabled")) sourceItem[self.innerDisabledKey] = !!options.disabled;
      }
    },

    /** 向指定父节点追加子节点 */
    appendTo: function (parentValue, newData) {
      var self = this;
      var parentIdx = self.treeList.findIndex(function (it) { return it.id === parentValue; });
      if (parentIdx === -1) return;
      var parentItem = self.treeList[parentIdx];

      // 确保父节点不是叶子节点
      if (parentItem.lastRank) {
        parentItem.lastRank = false;
        parentItem.showChild = true;
      }

      // 将 newData（可以是数组或单个对象）规范化
      var dataArr = Array.isArray(newData) ? newData : [newData];

      // 同步到 currentTreeData
      var sourceParent = self.getItemFromTreeData(self.currentTreeData, parentValue);
      if (sourceParent) {
        if (!sourceParent[self.innerChildrenKey]) {
          sourceParent[self.innerChildrenKey] = [];
        }
        dataArr.forEach(function (d) {
          sourceParent[self.innerChildrenKey].push(d);
        });
      }

      // 构建 treeList 节点并插入
      var pid = parentItem.parentId.concat([parentItem.id]);
      var parentObj = {};
      parentObj[self.innerValueKey] = parentItem.id;
      parentObj[self.innerLabelKey] = parentItem.name;
      var parents = parentItem.parents.concat([parentObj]);

      var lists = self.getRenderTreeList(dataArr, parentItem.rank + 1, pid, parents);

      // 找到父节点的最后一个子孙的位置
      var insertIdx = parentIdx;
      for (var i = parentIdx + 1; i < self.treeList.length; i++) {
        if (self.treeList[i].parentId.indexOf(parentValue) !== -1) {
          insertIdx = i;
        } else {
          break;
        }
      }
      self.treeList.splice(insertIdx + 1, 0, ...lists);
    },

    /** 在指定节点前插入节点 */
    insertBefore: function (value, newData) {
      var self = this;
      var idx = self.treeList.findIndex(function (it) { return it.id === value; });
      if (idx === -1) return;
      var refItem = self.treeList[idx];
      var dataArr = Array.isArray(newData) ? newData : [newData];

      // 同步到 currentTreeData
      var parentValue = refItem.parentId.length ? refItem.parentId[refItem.parentId.length - 1] : null;
      if (parentValue) {
        var sourceParent = self.getItemFromTreeData(self.currentTreeData, parentValue);
        if (sourceParent) {
          var children = sourceParent[self.innerChildrenKey] || [];
          var refIdx = children.findIndex(function (c) { return c[self.innerValueKey] === value; });
          if (refIdx !== -1) {
            dataArr.forEach(function (d, i) { children.splice(refIdx + i, 0, d); });
          }
        }
      } else {
        var refIdx2 = self.currentTreeData.findIndex(function (c) { return c[self.innerValueKey] === value; });
        if (refIdx2 !== -1) {
          dataArr.forEach(function (d, i) { self.currentTreeData.splice(refIdx2 + i, 0, d); });
        }
      }

      var lists = self.getRenderTreeList(dataArr, refItem.rank, refItem.parentId, refItem.parents);
      self.treeList.splice(idx, 0, ...lists);
    },

    /** 在指定节点后插入节点 */
    insertAfter: function (value, newData) {
      var self = this;
      var idx = self.treeList.findIndex(function (it) { return it.id === value; });
      if (idx === -1) return;
      var refItem = self.treeList[idx];
      var dataArr = Array.isArray(newData) ? newData : [newData];

      // 找到该节点及其所有子孙的最后一个位置
      var insertIdx = idx;
      for (var i = idx + 1; i < self.treeList.length; i++) {
        if (self.treeList[i].parentId.indexOf(value) !== -1) {
          insertIdx = i;
        } else {
          break;
        }
      }

      // 同步到 currentTreeData
      var parentValue = refItem.parentId.length ? refItem.parentId[refItem.parentId.length - 1] : null;
      if (parentValue) {
        var sourceParent = self.getItemFromTreeData(self.currentTreeData, parentValue);
        if (sourceParent) {
          var children = sourceParent[self.innerChildrenKey] || [];
          var refIdx = children.findIndex(function (c) { return c[self.innerValueKey] === value; });
          if (refIdx !== -1) {
            dataArr.forEach(function (d, i) { children.splice(refIdx + 1 + i, 0, d); });
          }
        }
      } else {
        var refIdx2 = self.currentTreeData.findIndex(function (c) { return c[self.innerValueKey] === value; });
        if (refIdx2 !== -1) {
          dataArr.forEach(function (d, i) { self.currentTreeData.splice(refIdx2 + 1 + i, 0, d); });
        }
      }

      var lists = self.getRenderTreeList(dataArr, refItem.rank, refItem.parentId, refItem.parents);
      self.treeList.splice(insertIdx + 1, 0, ...lists);
    },

    /** 选中/取消选中指定节点 */
    checkedFunc: function (values, state) {
      if (state === undefined) state = true;
      var self = this;
      if (Array.isArray(values)) {
        values.forEach(function (id) {
          var item = self.treeList.find(function (it) { return it.id === id; });
          if (item) item.checked = !!state;
        });
      } else {
        var _item = self.treeList.find(function (it) { return it.id === values; });
        if (_item) _item.checked = !!state;
      }
    },

    /** 获取选中的完整参数 */
    getCheckedParams: function () {
      var self = this;
      var rt = [];
      self.treeList.forEach(function (v) {
        if (v.checked) {
          var obj = {};
          obj.parents = v.parents;
          obj = Object.assign(obj, v.source);
          delete obj.children;
          rt.push(obj);
        }
      });
      return rt;
    },

    // ==================== 节点可选判断（valueMode） ====================
    canCheckNode: function (item) {
      if (this.valueMode === "onlyLeaf") return item.lastRank;
      if (this.valueMode === "all") return true;
      if (this.valueMode === "parentFirst") return true;
      return item.lastRank;
    },

    isDisableCheck: function (item) {
      if (this.disableCheck === true) return true;
      if (typeof this.disableCheck === "function") return !!this.disableCheck(item.source);
      return false;
    },

    // ==================== Internal ====================
    _watchShowTreePopup: function (bool) {
      var self = this;
      var keepAlive = self.keepAlive;
      if (bool) {
        if (keepAlive) {
          if (self.load && Object.keys(self.nodeInitContrl || {}).length === 0) {
            self.cInitTree();
          } else if (!self.load) {
            var params = compareJsonArrays(self.currentTreeData, self.data);
            if (!params.areEqual) {
              self.nodeInitContrl = {};
              self.cInitTree();
            }
          }
        } else {
          self.cInitTree();
        }
      } else {
        if (!keepAlive) {
          self.$nextTick(function () {
            setTimeout(function () {
              self.treeList.length = 0;
              self.nodeInitContrl = {};
            });
          });
        }
      }
    },

    onPopupVisibleChange: function (visible) {
      if (!visible) {
        this.handleCancel("masktap");
      }
    },
    handleCancel: function (type) {
      this.cHide();
      this.$emit("cancel", type);
    },
    handleConfirm: function () {
      var rt = this.getCheckedParams();
      this.cHide();
      this.$emit("confirm", rt);
    },
    getLabelSlotData: function (item) {
      var _it = this.getItemFromTreeData(this.currentTreeData, item.id);
      var it = Object.assign({}, _it);
      if (it) delete it[this.innerChildrenKey];
      return it;
    },

    handleAddSubItem: function (item) {
      if (item.disabled) return;
      var it = Object.assign({}, item);
      if (item.lastRank) {
        item.lastRank = false;
        item.showChild = true;
      }
      var self = this;
      self.$nextTick(function () {
        self.initNum++;
        var parentId = item.parentId.concat([]);
        var parents = item.parents.concat([]);
        parentId.push(item.id);
        parents.push(item);
        it.disabled = false;
        it.rank = it.rank + 1;
        it.id = "tdesign-uniapp-tree-" + self.initNum;
        it.parentId = parentId.slice();
        it.parents = parents.slice();
        it.show = true;
        it.showChild = false;
        it.open = false;
        it.name = "";
        it.status = "edit";
        it.source = {};
        it.hideArr = [];
        it.lastRank = true;
        var index = -1;
        for (var i = self.treeList.length - 1; i >= 0; i--) {
          if (self.treeList[i].id === item.id) { index = i; break; }
        }
        if (index !== -1) {
          self.treeList.splice(index + 1, 0, it);
        }
      });
    },

    handleAddSameItem: function (item) {
      if (item.disabled) return;
      var it = Object.assign({}, item);
      var index = -1;
      for (var i = this.treeList.length - 1; i >= 0; i--) {
        if (this.treeList[i].id === item.id || this.treeList[i].parentId.indexOf(item.id) !== -1) {
          index = i; break;
        }
      }
      this.initNum++;
      it.id = "tdesign-uniapp-tree-" + this.initNum;
      it.source = {};
      it.hideArr = [];
      it.name = "";
      it.status = "edit";
      if (index !== -1) {
        this.treeList.splice(index + 1, 0, it);
      }
    },

    handleComplete: function (item) {
      var self = this;
      if (item.name) {
        item.status = "loading";
        if (item.operateCallback) {
          item.operateCallback("complete", item).then(function () {
            return self.$nextTick();
          }).then(function () { item.status = ""; });
        } else {
          item.status = "";
        }
      } else {
        uni.showToast({ title: "请先完善内容", icon: "none" });
      }
    },

    handleEditItem: function (item) {
      if (item.disabled) return;
      item.status = "edit";
    },

    handleRevert: function () {
      this.uiModeInit(false);
    },

    handleDelItem: function (item) {
      if (item.disabled) return;
      var self = this;
      item.status = "loading";
      if (item.operateCallback) {
        item.operateCallback("delete", item).then(function () {
          return self.$nextTick();
        }).then(function () { self.delItemFunc(item); });
      } else {
        self.delItemFunc(item);
      }
    },

    getShowFocusItemLine: function (item) {
      return this.draggable && this.dragItem.isDragging && item.id === this.dragItem.focusTreeItemId && !item.showChild;
    },

    delItemFunc: function (item) {
      var id = (item && item.id) || "";
      var ids = [];
      this.treeList.forEach(function (it, index) {
        if (it.id === id || it.parentId.indexOf(id) !== -1) ids.push(index);
      });
      ids.sort(function (a, b) { return b - a; });
      var self = this;
      ids.forEach(function (index) { self.treeList.splice(index, 1); });
    },

    _removeFromTreeData: function (treeData, value) {
      var self = this;
      for (var i = 0; i < treeData.length; i++) {
        if (treeData[i][self.innerValueKey] === value) {
          treeData.splice(i, 1);
          return true;
        }
        var children = treeData[i][self.innerChildrenKey];
        if (children && children.length) {
          if (self._removeFromTreeData(children, value)) return true;
        }
      }
      return false;
    },

    // 收集所有非叶子节点 ID（expandAll 用）
    _collectAllParentIds: function (list) {
      var self = this;
      var ids = [];
      (list || []).forEach(function (item) {
        var children = item[self.innerChildrenKey];
        if (children && children.length) {
          ids.push(item[self.innerValueKey]);
          ids = ids.concat(self._collectAllParentIds(children));
        }
      });
      return ids;
    },

    // 收集指定层级以内的节点 ID（expandLevel 用）
    _collectIdsByLevel: function (list, level, currentLevel) {
      if (!currentLevel) currentLevel = 0;
      var self = this;
      var ids = [];
      if (currentLevel >= level) return ids;
      (list || []).forEach(function (item) {
        var children = item[self.innerChildrenKey];
        if (children && children.length) {
          ids.push(item[self.innerValueKey]);
          ids = ids.concat(self._collectIdsByLevel(children, level, currentLevel + 1));
        }
      });
      return ids;
    },

    // expandParent: 确保 expanded 中的节点的所有祖先也被展开
    _ensureParentExpanded: function (expandedIds) {
      var self = this;
      var parentMap = {};
      // 建立 value -> parentValue 的映射
      function buildMap(list, parentValue) {
        (list || []).forEach(function (item) {
          var val = item[self.innerValueKey];
          parentMap[val] = parentValue;
          var children = item[self.innerChildrenKey];
          if (children && children.length) {
            buildMap(children, val);
          }
        });
      }
      buildMap(self.data, null);

      var result = expandedIds.slice();
      expandedIds.forEach(function (id) {
        var pid = parentMap[id];
        while (pid !== null && pid !== undefined) {
          if (result.indexOf(pid) === -1) result.push(pid);
          pid = parentMap[pid];
        }
      });
      return result;
    },

    getRenderTreeList: function (list, rank, parentId, parents) {
      if (!list) list = [];
      if (!rank) rank = 0;
      if (!parentId) parentId = [];
      if (!parents) parents = [];
      var self = this;
      var result = [];
      list.forEach(function (item) {
        var halfChecked = self.getHalfCheckedFormTreeData(item);
        var bool1 = self.innerExpanded.indexOf(item[self.innerValueKey]) !== -1;
        var len = parentId.length;
        var bool2 = len > 0 ? self.innerExpanded.indexOf(parentId[len - 1]) !== -1 : bool1;

        // 判断该节点是否为叶子节点
        var children = item[self.innerChildrenKey];
        var isLeaf = !(Array.isArray(children) && children.length > 0) && !(self.lazy && self.load && Array.isArray(children) && children.length === 0);

        // 构造临时节点用于 canCheckNode 判断
        var tempNode = { lastRank: isLeaf };
        var rawChecked = item.checked || false;
        // 如果节点不可选（如 valueMode=onlyLeaf 时的非叶子节点），忽略数据中的 checked
        var checkedVal = self.canCheckNode(tempNode) ? rawChecked : false;

        result.push({
          id: item[self.innerValueKey],
          name: item[self.innerLabelKey],
          source: item,
          parentId: parentId,
          parents: parents,
          rank: rank,
          showChild: bool1,
          open: bool1,
          show: bool1 || bool2 || rank === 0,
          hideArr: [],
          ouputText: "",
          hierarchyText: "",
          orChecked: checkedVal,
          checked: checkedVal,
          halfChecked: halfChecked,
          disabled: !!(self.disabled || (self.innerDisabledKey && item[self.innerDisabledKey])),
          status: "",
          operateCallback: typeof item.operateCallback === "function" ? item.operateCallback : undefined,
        });

        if (bool1) {
          self.$set ? self.$set(self.nodeInitContrl, item[self.innerValueKey], true) : (self.nodeInitContrl[item[self.innerValueKey]] = true);
        } else {
          self.$set ? self.$set(self.nodeInitContrl, item[self.innerValueKey], undefined) : (self.nodeInitContrl[item[self.innerValueKey]] = undefined);
        }

        var children = item[self.innerChildrenKey];
        if ((Array.isArray(children) && children.length > 0) || (self.lazy && self.load && Array.isArray(children) && children.length === 0)) {
          // has children or lazy placeholder
        } else {
          result[result.length - 1].lastRank = true;
        }
      });
      return result;
    },

    cRenderTreeList: function (list, rank, parentId, parents) {
      if (!list) list = [];
      if (!rank) rank = 0;
      if (!parentId) parentId = [];
      if (!parents) parents = [];
      var self = this;
      list.forEach(function (item) {
        var halfChecked = self.getHalfCheckedFormTreeData(item);
        var bool1 = self.innerExpanded.indexOf(item[self.innerValueKey]) !== -1;
        var len = parentId.length;
        var bool2 = len > 0 ? self.innerExpanded.indexOf(parentId[len - 1]) !== -1 : bool1;

        // 判断该节点是否为叶子节点
        var children = item[self.innerChildrenKey];
        var isLeaf = !(Array.isArray(children) && children.length > 0) && !(self.lazy && self.load && Array.isArray(children) && children.length === 0);

        // 构造临时节点用于 canCheckNode 判断
        var tempNode = { lastRank: isLeaf };
        var rawChecked = item.checked || false;
        // 如果节点不可选（如 valueMode=onlyLeaf 时的非叶子节点），忽略数据中的 checked
        var checkedVal = self.canCheckNode(tempNode) ? rawChecked : false;

        self.treeList.push({
          id: item[self.innerValueKey],
          name: item[self.innerLabelKey],
          source: item,
          parentId: parentId,
          parents: parents,
          rank: rank,
          showChild: bool1,
          open: bool1,
          show: bool1 || bool2 || rank === 0,
          hideArr: [],
          ouputText: "",
          hierarchyText: "",
          orChecked: checkedVal,
          checked: checkedVal,
          halfChecked: halfChecked,
          disabled: !!(self.disabled || (self.innerDisabledKey && item[self.innerDisabledKey])),
          status: "",
          operateCallback: typeof item.operateCallback === "function" ? item.operateCallback : undefined,
        });

        if (bool1) {
          self.$set ? self.$set(self.nodeInitContrl, item[self.innerValueKey], true) : (self.nodeInitContrl[item[self.innerValueKey]] = true);
        } else {
          self.$set ? self.$set(self.nodeInitContrl, item[self.innerValueKey], undefined) : (self.nodeInitContrl[item[self.innerValueKey]] = undefined);
        }

        var children = item[self.innerChildrenKey];
        if ((Array.isArray(children) && children.length > 0) || (self.lazy && self.load && Array.isArray(children) && children.length === 0)) {
          var pid = parentId.slice();
          var parr = parents.slice();
          pid.push(item[self.innerValueKey]);
          var parentObj = {};
          parentObj[self.innerValueKey] = item[self.innerValueKey];
          parentObj[self.innerLabelKey] = item[self.innerLabelKey];
          parr.push(parentObj);
          self.cRenderTreeList(children, rank + 1, pid, parr);
        } else if (children === null) {
          self.treeList[self.treeList.length - 1].lastRank = true;
        } else {
          self.treeList[self.treeList.length - 1].lastRank = true;
        }
      });
    },

    cDefaultSelect: function () {
      var self = this;
      self.treeList.forEach(function (v) {
        if (v.checked) {
          self.treeList.forEach(function (v2) {
            if (v.parentId.toString().indexOf(v2.parentId.toString()) >= 0) {
              v2.show = true;
              if (v.parentId.includes(v2.id)) {
                v2.showChild = true;
                v2.open = true;
              }
            }
          });
        }
      });
    },

    handleTreeItemTap: function (item, _index) {
      var self = this;
      var index = self.treeList.findIndex(function (it) { return it.id === item.id; });
      var nodeContext = { node: item.source, e: undefined };
      self.$emit("click", nodeContext);

      // activable 高亮激活
      if (self.activable) {
        var wasActive = self.innerActived.indexOf(item.id) !== -1;
        self.innerActived = wasActive ? [] : [item.id];
        self.$emit("active", self.innerActived, { node: item.source, e: undefined });
        self.$emit("update:actived", self.innerActived);
      }

      if (item.lastRank === true) {
        if (item.disabled) return;
        if (!self.isSelectMode) return;

        // 叶子节点点击选中逻辑
        self._handleCheckNode(item, index);
        return;
      }

      // expandOnClickNode 为 false 时，点击非叶子节点不展开
      if (!self.expandOnClickNode) return;

      // 搜索过滤模式下不展开
      if (self.filter) return;

      // lazy + load 异步加载
      var isLoadDataNeeded = self.lazy && self.load && !self.nodeInitContrl[item.id];

      function afterLoad() {
        var childLen = self.treeList.filter(function (it) { return it.parentId.includes(item.id); }).length;
        if (!isLoadDataNeeded && childLen > 50) {
          uni.showLoading({ title: "请稍后..." });
        }

        var id = item.id;
        item.showChild = !item.showChild;
        item.open = item.showChild ? true : !item.open;
        self.$emit("expand", { node: item.source, expanded: item.showChild, e: undefined });
        // 收集当前展开的节点 id 列表
        var expandedIds = [];
        self.treeList.forEach(function (it) {
          if (it.showChild) expandedIds.push(it.id);
        });
        if (item.showChild && expandedIds.indexOf(item.id) === -1) expandedIds.push(item.id);
        self.$emit("update:expanded", expandedIds);

        self.treeList.forEach(function (childItem) {
          if (!item.showChild) {
            if (!childItem.parentId.includes(id)) return;
            if (!self.foldAll) {
              if (childItem.lastRank !== true && !childItem.open) {
                childItem.showChild = false;
              }
              if (childItem.show) {
                childItem.hideArr[item.rank] = id;
              }
            } else {
              if (childItem.lastRank !== true) {
                childItem.showChild = false;
              }
            }
            childItem.show = false;
          } else {
            if (childItem.parentId[childItem.parentId.length - 1] === id) {
              childItem.show = true;
            }
            if (childItem.parentId.includes(id) && !self.foldAll) {
              if (childItem.hideArr[item.rank] === id) {
                childItem.show = true;
                if (childItem.open && childItem.showChild) {
                  childItem.showChild = true;
                } else {
                  childItem.showChild = false;
                }
                childItem.hideArr[item.rank] = null;
              }
            } else if (self.expandMutex && !childItem.parentId.includes(id)) {
              // expandMutex: 同级互斥展开
              if (childItem.id !== id) {
                var bool1 = item.parentId.some(function (pid) {
                  return (childItem.parentId && childItem.parentId.indexOf(pid) !== -1) || childItem.rank === 0;
                });
                var childItemParentId = childItem.parentId.slice();
                var _id = childItemParentId.length ? childItemParentId.pop() : "";
                var nodeList = [item, { parentId: childItemParentId.length ? childItemParentId : [] }];

                if (!childItem.lastRank) {
                  if (item.parentId.indexOf(childItem.id) === -1) {
                    childItem.showChild = false;
                  }
                  if (!bool1 && !self.isSiblingNode([item, childItem])) {
                    childItem.show = false;
                  } else if (childItem.rank !== 0 && _id !== id && self.isSiblingNode(nodeList)) {
                    childItem.show = false;
                  } else if (childItem.rank !== 0 && _id !== id && !self.isSiblingNode(nodeList) && self.isParentSiblingNode(nodeList)) {
                    childItem.show = false;
                  }
                } else {
                  if (!self.isSiblingNode([item, childItem]) && !bool1) {
                    childItem.show = false;
                  } else if (_id !== id && self.isSiblingNode(nodeList)) {
                    childItem.show = false;
                  } else if (_id !== id && !self.isSiblingNode(nodeList) && self.isParentSiblingNode(nodeList)) {
                    childItem.show = false;
                  }
                }
              }
            }
          }
        });

        setTimeout(function () { uni.hideLoading(); });
      }

      if (isLoadDataNeeded) {
        uni.showLoading({ title: "请稍后..." });
        self.load({
          $type: "nodeLoad",
          source: self.treeList[index].source,
        }).then(function (newChild) {
          var treeItem = self.getItemFromTreeData(self.currentTreeData, item.id);
          if (treeItem) {
            treeItem[self.innerChildrenKey] = newChild && newChild.length ? newChild : undefined;
          }
          var parentId = item.parentId || [];
          var parentObj = {};
          parentObj[self.innerValueKey] = item.id;
          parentObj[self.innerLabelKey] = item.name;
          var lists = self.getRenderTreeList(newChild || [], item.rank + 1, parentId.concat([item.id]), [parentObj]);
          self.nodeInitContrl[item.id] = true;
          self.treeList.splice(index + 1, 0, ...lists);
          self.$emit("load", { node: self.treeList[index].source });
          afterLoad();
        });
      } else {
        afterLoad();
      }
    },

    _handleCheckNode: function (item, index) {
      var self = this;
      if (!self.canCheckNode(item)) return;
      if (self.isDisableCheck(item)) return;

      // maxChecked 校验
      if (!self.treeList[index].checked && self.maxChecked > 0) {
        var currentCount = self.treeList.filter(function (it) { return it.checked; }).length;
        if (currentCount >= self.maxChecked) {
          uni.showToast({ title: "最多只能选择" + self.maxChecked + "个", icon: "none" });
          return;
        }
      }

      self.treeList[index].checked = !self.treeList[index].checked;

      if (self.changeVerify) {
        var current = Object.assign({}, item.source);
        current.checked = item.checked;
        var tip = self.changeVerify(current, self.isMultiple ? self.getCheckedParams() : [current]);
        if (tip) {
          self.treeList[index].checked = !self.treeList[index].checked;
          uni.showToast({ title: tip, icon: "none" });
          return;
        }
      }
      self.treeList[index].halfChecked = false;
      if (self.isMultiple && !self.checkStrictly && self.showHalfCheckedTips) {
        self.updateHalfChecked(index);
      } else if (self.isMultiple && self.checkStrictly) {
        self.updateParentChecked(index);
      }
      self.fixMultiple(index);
      self.$emit("change", self.getCheckedParams());
      self._emitValue();
    },

    isSiblingNode: function (targetArr) {
      if (!targetArr) targetArr = [];
      var target1 = targetArr[0] || {};
      var target1Id = "";
      if (target1.parentId && target1.parentId.length) {
        target1Id = target1.parentId[target1.parentId.length - 1];
      }
      return targetArr.every(function (item) {
        if (item && item.parentId && item.parentId.length) {
          return target1Id === item.parentId[item.parentId.length - 1];
        }
        return target1Id === "";
      });
    },

    isParentSiblingNode: function (targetArr) {
      if (!targetArr) targetArr = [];
      var target1 = targetArr[0] || {};
      var target1Id = "";
      if (target1.parentId && target1.parentId.length) {
        target1Id = target1.parentId[target1.parentId.length - 1];
      }
      return targetArr.every(function (item) {
        if (item && item.parentId && item.parentId.length) {
          return item.parentId.some(function (pid) { return pid === target1Id; }) && target1Id !== "";
        }
        return target1Id === "";
      });
    },

    getHalfCheckedFormTreeData: function (item) {
      var self = this;
      if (self.checkStrictly || !self.showHalfCheckedTips) return false;
      var children = item[self.innerChildrenKey];
      if (children && children.length) {
        return children.some(function (it) {
          if (it.checked) return true;
          if (it[self.innerChildrenKey] && it[self.innerChildrenKey].length) return self.getHalfCheckedFormTreeData(it);
          return false;
        });
      }
      return false;
    },

    getItemFromTreeData: function (treeData, id) {
      if (!id) return null;
      var self = this;
      var item = null;
      (treeData || []).some(function (it) {
        if (it[self.innerValueKey] === id) {
          item = it;
          return true;
        } else if (it[self.innerChildrenKey] && it[self.innerChildrenKey].length) {
          item = self.getItemFromTreeData(it[self.innerChildrenKey], id);
          return !!item;
        }
        return false;
      });
      return item;
    },

    handleTreeItemSelect: function (item, _index) {
      var self = this;
      self.dragItem.isDragging = false;
      var index = self.treeList.findIndex(function (it) { return it.id === item.id; });
      if (item.disabled) return;
      if (self.isDisableCheck(item)) return;

      // maxChecked 校验
      if (!self.treeList[index].checked && self.maxChecked > 0) {
        var currentCount = self.treeList.filter(function (it) { return it.checked; }).length;
        if (currentCount >= self.maxChecked) {
          uni.showToast({ title: "最多只能选择" + self.maxChecked + "个", icon: "none" });
          return;
        }
      }

      self.treeList[index].checked = !self.treeList[index].checked;

      if (self.changeVerify) {
        var current = Object.assign({}, item.source);
        current.checked = item.checked;
        var tip = self.changeVerify(current, self.isMultiple ? self.getCheckedParams() : [current]);
        if (tip) {
          self.treeList[index].checked = !self.treeList[index].checked;
          uni.showToast({ title: tip, icon: "none" });
          return;
        }
      }

      self.treeList[index].halfChecked = false;
      if (self.isMultiple && self.checkStrictly) {
        if (!item.lastRank) {
          var source = item.source || {};
          var children = source[self.innerChildrenKey] || [];
          var checkedKeyList = self.getChildrenKeys(children);
          self.treeList.forEach(function (v, i) {
            if (checkedKeyList.indexOf(v.id) !== -1) {
              if (self.checkStrictlyModel === "weak") {
                if (!self.treeList[i].disabled) self.treeList[i].checked = self.treeList[index].checked;
              } else if (self.checkStrictlyModel === "strong") {
                self.treeList[i].checked = self.treeList[index].checked;
              }
            }
          });
        }
        self.updateParentChecked(index);
      } else if (self.isMultiple && !self.checkStrictly && self.showHalfCheckedTips) {
        self.updateHalfChecked(index);
      } else {
        self.fixMultiple(index);
      }
      self.$emit("change", self.getCheckedParams());
      self._emitValue();
    },

    getItemFortreeListChildLen: function (id) {
      var l = 0;
      this.treeList.forEach(function (item) {
        if (item.parentId.indexOf(id) !== -1) l++;
      });
      return l;
    },

    scrollCallback: function (e) {
      if (this.draggable) {
        var self = this;
        clearTimeout(self.timer);
        self.timer = setTimeout(function () {
          var detail = e.detail;
          self.scrollTop = detail.scrollTop;
        }, 100);
      }
    },

    updateParentChecked: function (index) {
      var self = this;
      var parentId = (self.treeList[index].parentId || []).concat([]).reverse();
      if (parentId && parentId.length) {
        parentId.forEach(function (id) {
          var parentTreeDataItem = self.getItemFromTreeData(self.currentTreeData, id);
          if (!parentTreeDataItem) return;
          var childrenIds = (parentTreeDataItem[self.innerChildrenKey] || []).map(function (i) { return i[self.innerValueKey]; });
          var allChecked = self.treeList.filter(function (it) { return childrenIds.indexOf(it.id) !== -1; }).every(function (it) { return it.checked; });
          var allUnchecked = self.treeList.filter(function (it) { return childrenIds.indexOf(it.id) !== -1; }).every(function (it) { return !it.checked; });
          var parentItem = self.treeList.find(function (it) { return it.id === id; });
          if (parentItem) {
            if (self.checkStrictlyModel === "weak") {
              if (allChecked && !parentItem.disabled) parentItem.checked = true;
              else if (allUnchecked && !parentItem.disabled) parentItem.checked = false;
            } else if (self.checkStrictlyModel === "strong") {
              parentItem.checked = allChecked;
            }
            if (self.showHalfCheckedTips && !parentItem.checked) {
              parentItem.halfChecked = self.treeList.filter(function (it) { return childrenIds.indexOf(it.id) !== -1; }).some(function (it) { return it.checked; });
            }
          }
        });
      }
    },

    updateHalfChecked: function (index) {
      var self = this;
      var parentId = (self.treeList[index].parentId || []).concat([]).reverse();
      if (parentId && parentId.length) {
        parentId.forEach(function (id) {
          var parentTreeDataItem = self.getItemFromTreeData(self.currentTreeData, id);
          if (!parentTreeDataItem) return;
          var childrenIds = (parentTreeDataItem[self.innerChildrenKey] || []).map(function (i) { return i[self.innerValueKey]; });
          var allUnchecked = self.treeList
            .filter(function (it) { return childrenIds.indexOf(it.id) !== -1; })
            .every(function (it) { return !it.checked && !it.halfChecked; });
          var someChecked = self.treeList
            .filter(function (it) { return childrenIds.indexOf(it.id) !== -1; })
            .some(function (it) { return it.checked || it.halfChecked; });
          var parentItem = self.treeList.find(function (it) { return it.id === id; });
          if (parentItem && !parentItem.checked) {
            parentItem.halfChecked = !allUnchecked && someChecked;
          }
        });
      }
      if (!self.treeList[index].checked) {
        var source = self.treeList[index].source || {};
        var children = source[self.innerChildrenKey] || [];
        var checkedKeyList = self.getChildrenKeys(children);
        var someChecked2 = self.treeList.filter(function (it) { return checkedKeyList.indexOf(it.id) !== -1; }).some(function (it) { return it.checked; });
        if (someChecked2) {
          self.treeList[index].halfChecked = true;
        }
      }
    },

    showHalfChecked: function (item) {
      return this.isMultiple && item.halfChecked === true;
    },

    getChildrenKeys: function (children) {
      var self = this;
      var keys = [];
      (children || []).forEach(function (item) {
        keys.push(item[self.innerValueKey]);
        if (item[self.innerChildrenKey] && item[self.innerChildrenKey].length) {
          keys = keys.concat(self.getChildrenKeys(item[self.innerChildrenKey]));
        }
      });
      return keys;
    },

    fixMultiple: function (index) {
      var self = this;
      if (!self.isMultiple) {
        // 单选模式：当前项的 checked 已在上层 toggle 过
        // 如果当前项被取消选中，则全部清空；否则仅保留当前项选中
        var isChecked = self.treeList[index].checked;
        self.treeList.forEach(function (v, i) {
          self.treeList[i].checked = isChecked ? (i === index) : false;
        });
      }
    },

    handleClear: function () {
      var self = this;
      self.treeList.forEach(function (item) {
        // 如果节点本身不可选（canCheckNode 返回 false），强制清除
        if (!self.canCheckNode(item)) {
          item.checked = false;
          item.halfChecked = false;
          return;
        }
        if (self.isMultiple && self.checkStrictly) {
          if (self.checkStrictlyModel === "strong") {
            item.checked = false;
          } else if (self.checkStrictlyModel === "weak") {
            if (!item.disabled) item.checked = false;
          } else {
            item.checked = false;
          }
        } else {
          if (!item.disabled) item.checked = false;
        }
        item.halfChecked = false;
      });
      self.$emit("change", self.getCheckedParams());
      self.$emit("clear");
      self._emitValue();
    },

    treeItemfocus: function (e) {
      if (this.draggable && this.dragItem.isDragging) {
        var self = this;
        var touches = e.touches[0];
        if (!touches) return;
        var query = uni.createSelectorQuery().in(self);
        query
          .selectAll(".tdesign-uniapp-tree-item-block")
          .boundingClientRect(function (rects) {
            (rects || []).forEach(function (rect, index) {
              if (touches.clientX >= rect.left && touches.clientX <= rect.right && touches.clientY >= rect.top && touches.clientY <= rect.bottom) {
                var showTreeList = self.computedTreeList.filter(function (it) { return it.show; });
                if (showTreeList && showTreeList.length) {
                  var data = showTreeList[index] || null;
                  if (data) {
                    var bool = data.parentId.some(function (parentid) { return parentid === self.dragItem.data.id; });
                    if (self.draggable && !bool && !data.showChild) {
                      self.dragItem.focusTreeItemId = data.id;
                      self.$emit("dragover", { node: data.source, e: e });
                    } else {
                      if (self.dragItem.focusTreeItemId) {
                        self.$emit("dragleave", { node: data.source, e: e });
                      }
                      self.dragItem.focusTreeItemId = "";
                    }
                  } else {
                    self.dragItem.focusTreeItemId = "";
                  }
                } else {
                  self.dragItem.focusTreeItemId = "";
                }
              }
            });
          })
          .exec();
      }
    },

    onTouchStartItem: function (event, item) {
      if (item && item.disabled) return;
      var touch = event.touches[0];
      this.dragItem.data = item;
      this.dragItem.currentY = touch.clientY;
      this.dragItem.isDragging = true;
      this.$emit("dragstart", { node: item.source, e: event });
    },

    onTouchMove: function (event) {
      var touch = event.touches[0];
      this.dragItem.currentY = touch.clientY;
      if (this.draggable && this.dragItem.isDragging && this.throttleFunc) {
        this.throttleFunc(event);
      }
    },

    onTouchEnd: function (event) {
      if (this.dragItem.isDragging) {
        this.dragItem.isDragging = false;
        this.handleDrag(event);
        this.$emit("dragend", { node: this.dragItem.data.source, e: event });
      }
    },

    swapSegmentWithElement: function (arr, startIndex, length, endIndex, realyNextItem) {
      if (length === 0) {
        var startItem = JSON.parse(JSON.stringify(arr[startIndex]));
        startItem.parents = realyNextItem.parents;
        startItem.parentId = realyNextItem.parentId;
        startItem.rank = realyNextItem.rank;
        arr.splice(startIndex, 1);
        if (startIndex >= endIndex) {
          arr.splice(endIndex + 1, 0, startItem);
        } else {
          arr.splice(endIndex, 0, startItem);
        }
      } else {
        var _endIndex = endIndex + 1;
        var endItemParents = realyNextItem.parents || [];
        var firstItem = null;
        var segment = arr.slice(startIndex, startIndex + length).map(function (item, index) {
          if (endItemParents.length) {
            if (index === 0) {
              item.parents = realyNextItem.parents;
              item.parentId = realyNextItem.parentId;
              item.rank = realyNextItem.rank;
              firstItem = JSON.parse(JSON.stringify(item));
            } else {
              var firstParentIdx = item.parentId.findIndex(function (pid) { return firstItem.id === pid; });
              if (firstParentIdx !== -1) {
                var newParents = item.parents.slice(firstParentIdx + 1);
                var newParentId = item.parentId.slice(firstParentIdx + 1);
                newParents.unshift.apply(newParents, [].concat(realyNextItem.parents, [firstItem]));
                newParentId.unshift.apply(newParentId, [].concat(realyNextItem.parentId, [firstItem.id]));
                item.parents = newParents;
                item.parentId = newParentId;
                item.rank = item.parentId.length;
              }
            }
          } else {
            if (index === 0) {
              item.parents = [];
              item.parentId = [];
              item.rank = 0;
              firstItem = JSON.parse(JSON.stringify(item));
            } else {
              var cutIndex = item.parentId.findIndex(function (pid) { return firstItem.id === pid; });
              if (cutIndex !== -1) {
                item.parents = item.parents.slice(cutIndex);
                item.parentId = item.parentId.slice(cutIndex);
                item.rank = item.parentId.length;
              }
            }
          }
          return item;
        });
        arr.splice(startIndex, length);
        if (startIndex >= _endIndex) {
          arr.splice(_endIndex, 0, ...segment);
        } else {
          arr.splice(_endIndex - length, 0, ...segment);
        }
      }
      return arr;
    },

    handleDrag: function (event) {
      var self = this;
      var prvItem = self.dragItem.data;
      var prvChildLen = 0;
      var prvIndex = -1;
      var nextIndex = -1;
      var realyNextItem = null;

      self.treeList.forEach(function (item, index) {
        if (item.id === prvItem.id) prvIndex = index;
        if (item.id === self.dragItem.focusTreeItemId) {
          realyNextItem = item;
          nextIndex = item.showChild ? index : index + self.getItemFortreeListChildLen(item.id);
        }
        if (item.parentId.some(function (pid) { return pid === prvItem.id; })) {
          prvChildLen++;
        }
      });

      if (prvIndex !== -1 && nextIndex !== -1 && realyNextItem) {
        var treelist = JSON.parse(JSON.stringify(self.treeList));
        if (prvChildLen !== 0) prvChildLen++;
        self.treeList = self.swapSegmentWithElement(treelist, prvIndex, prvChildLen, nextIndex, realyNextItem);
        self.$emit("drop", { node: prvItem.source, target: realyNextItem.source, e: event });
      }
    },

    uiModeInit: function (keepAlive) {
      var self = this;
      uni.getSystemInfo({
        success: function (res) {
          self.windowHeight = res.windowHeight;
        },
      });

      if (self.usePopup) {
        // popup mode: handled by watch
      } else {
        self.top = "0px";
        self.$nextTick(function () {
          self.showTree = true;
        });
      }
    },

    // ==================== v-model 受控 ====================
    _syncValueToChecked: function (values) {
      var self = this;
      if (!self.treeList.length) return;
      self.treeList.forEach(function (item) {
        item.checked = values.indexOf(item.id) !== -1;
      });
    },
    _emitValue: function () {
      var values = this._getCheckedValues();
      this.$emit("update:value", values);
      this.$emit("update:modelValue", values);
    },
    _getCheckedValues: function () {
      var self = this;
      var values = [];
      self.treeList.forEach(function (item) {
        if (!item.checked) return;
        // valueMode 过滤
        if (self.valueMode === "onlyLeaf" && !item.lastRank) return;
        if (self.valueMode === "parentFirst") {
          // 如果父节点已选中，跳过子节点
          var parentChecked = item.parentId.some(function (pid) {
            var parent = self.treeList.find(function (it) { return it.id === pid; });
            return parent && parent.checked;
          });
          if (parentChecked) return;
        }
        values.push(item.id);
      });
      return values;
    },
  },
};
</script>

<style>
/* 不使用 scoped，原因：
   1. CSS 变量定义在 .tdesign-uniapp-tree 上，scoped 会阻止变量向 t-popup 等子组件内部继承
   2. 小程序端 scoped 对 slot 穿透支持不完善
   3. 所有类名已有 tdesign-uniapp-tree- 前缀，不会污染全局样式 */
@import "./style.css";
</style>
