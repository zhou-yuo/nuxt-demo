<template>
  <div class="">
    <div class="colors">
      <div 
        v-for="item in paletteColors" 
        class="color-item"
      >
        <div class="color-block"
          :style="{ backgroundColor: item }"
          @click="copyToClipboard(item)"
        ></div>
        <div class="color-text">
          {{ item }}
        </div>
        <transition name="fade">
          <div v-if="copiedColor === item" class="copied-feedback">
            copied
          </div>
        </transition>
      </div>
    </div>

    <div class="mode-selector">
      <label>
        <input type="radio" name="mode" value="light" checked @change="modeChange($event)" />
        <span>light</span>
      </label>

      <label>
        <input type="radio" name="mode" value="dark" @change="modeChange($event)" />
        <span>dark</span>
      </label>
    </div>

    <div class="color-picker-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
// import { generate } from '@ant-design/colors';
// import Pickr from '@simonwep/pickr';
// import '@simonwep/pickr/dist/themes/nano.min.css';

// 动态导入 @ant-design/colors 的 generate 函数
let generateAntdColors;
// 动态导入 Pickr 模块
let Pickr = null;

const paletteColors = ref([]); // 用于存储生成的颜色

let pickrInstance = null; // 用于存储 Pickr 实例，以便后续操作

const initModule = async () => {
  if (import.meta.client) {
    try {
      // 动态导入 Pickr 及其 CSS
      const PickrModule = await import('@simonwep/pickr');
      Pickr = PickrModule.default; // Pickr 是默认导出

      await import('@simonwep/pickr/dist/themes/nano.min.css'); // 动态导入 CSS

      // 动态导入 @ant-design/colors
      const antdColorsModule = await import('@ant-design/colors');
      generateAntdColors = antdColorsModule.generate;

      initColorPicker()

    } catch (error) {
      console.error("Error loading @ant-design/colors:", error);
    }
  }
}

const initColorPicker = async () => {
  pickrInstance = Pickr.create({
    el: ".color-picker-container", // 指定 Pickr 渲染的元素
    theme: "nano", // 'classic', or 'monolith', or 'nano'

    // 默认颜色
    default: "#1677ff",
    
    // 如果为 true，用户将无法调整任何透明度
    // 透明度将锁定为 1，并且透明度滑块将被移除
    // HSVaColor 对象也不包含 alpha 通道，因此 toString() 方法只输出 HSV、HSL、RGB、HEX 等
    lockOpacity: false,

    // 隐藏预设颜色
    swatches: null, // 将 swatches 设置为 null 或空数组 []
    
    // 定义更改/保存行为：
    // - 设置为 `true` 表示在按下保存前保持当前颜色不变
    // - 设置为 `false` 表示在每次更改（来自选择器或调色板）时立即将颜色应用到按钮和预览（保存）
    comparison: false,
    
    // 输入/输出文本框的默认颜色表示形式
    // 有效选项：`HEX`, `RGBA`, `HSVA`, `HSLA` 和 `CMYK`
    defaultRepresentation: 'HEX',

    // 配置交互组件
    components: {
      // 主要组件
      preview: true, // 显示颜色预览
      opacity: true, // 再次确保没有透明度滑块
      hue: true, // 显示色相滑块

      // 底部交互组件
      interaction: {
        hex: true, // 显示 Hex 输入框
        rgba: true, // 显示 RGBA 输入框 (不影响选择，只是显示)
        // hsla: true, // 如果不需要显示 HSLA，可以设置为 false
        // hsva: true, // 如果不需要显示 HSVA，可以设置为 false
        // cmyk: true, // 如果不需要显示 CMYK，可以设置为 false
        input: true, // 显示所有颜色格式的输入框 (取决于 hex, rgba, hsla, hsva, cmyk 的设置)
        clear: false, // 不显示清除按钮
        save: false // 显示保存按钮
      }
    },
    i18n: {
      "btn:save": "保存", // 设置保存按钮的文本
      "btn:clear": "清除", // 如果有清除按钮，也可以在这里设置
      "btn:cancel": "取消", // 如果有取消按钮
      "btn:last-color": "上次颜色", // 如果有上次颜色按钮
      "aria:open-color-picker": "打开颜色选择器", // 无障碍标签
      "aria:choose-color": "选择颜色", // 无障碍标签
      "aria:previous-color": "上一个颜色" // 无障碍标签
    }
  });

  // 监听颜色变化事件 (用户拖动滑块时触发)
  pickrInstance.on("change", (color, source, instance) => {
    if(color !== null) {
      const hexColor = color.toHEXA().toString(); // 获取 Hex 格式颜色
      generateColor(hexColor); // 调用生成颜色函数
    }
  });

  // 监听颜色选择器初始化事件，确保初始颜色显示正确
  pickrInstance.on("init", (instance) => {
    const initialColor = instance.getColor().toHEXA().toString();
    generateColor(initialColor); // 调用生成颜色函数
  });
}

onMounted(() => {
  initModule();
});

const generateColor = (hexColor = '') => {
  try {
    if (!hexColor || !generateAntdColors) { // 检查 generateAntdColors 是否已加载
      return;
    }
    const mode = document.querySelector('input[name="mode"]:checked').value; // 获取选中的模式
    console.log("🚀 ~ generateColor ~ mode:", mode)
    const colors = generateAntdColors(hexColor, { // 使用赋值后的变量
      theme: mode,
      backgroundColor: mode === 'dark' ? '#000000' : '#ffffff',
    });
    paletteColors.value = colors;
  } catch (error) {
    console.error("Error generating color:", error);
  }
}

const copiedColor = ref(null); // 用于存储最近复制的颜色，以便显示反馈

// 复制到剪贴板的函数
const copyToClipboard = (text) => {
  if (import.meta.client) { // 确保只在客户端执行
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed'; // 避免滚动
      textarea.style.opacity = '0'; // 隐藏元素
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy'); // 使用 document.execCommand('copy')
      document.body.removeChild(textarea);

      copiedColor.value = text; // 设置复制的颜色
      setTimeout(() => {
        copiedColor.value = null; // 2秒后清除提示
      }, 2000);

      console.log(`Copied: ${text}`);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // 可以添加一个更友好的错误提示
    }
  }
};

const modeChange = (event) => {
  const color = pickrInstance._color; // 获取当前颜色对象
  if(color !== null) {
    const hexColor = color.toHEXA().toString(); // 获取 Hex 格式颜色
    generateColor(hexColor); // 调用生成颜色函数
  }
};

</script>

<style lang="scss">
$colorItemSize: 80px; // 定义颜色块的大小
.colors {
  margin: 30px 0;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  height: $colorItemSize;
  .color-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .color-block {
    width: $colorItemSize;
    height: $colorItemSize;
    background-color: #ffffff; // 默认颜色
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
  .color-text {
    margin-top: 5px;
    font-size: 12px;
    color: #333;
    text-align: center;
  }
}

.mode-selector {
  margin: 30px 0;
  display: flex;
  align-items: center;
  gap: 20px;
}

.copied-feedback {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8); /* 更不透明的背景 */
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  white-space: nowrap;
  pointer-events: none; /* 不阻碍点击 */
  z-index: 20; /* 确保在最上层 */
}

/* 复制提示的过渡效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>