import { defineConfig } from 'unocss';
import presetUno from '@unocss/preset-uno';
import presetAttributify from '@unocss/preset-attributify';
import presetIcons from '@unocss/preset-icons';

export default defineConfig({
  presets: [
    presetUno(), // 兼容 Tailwind / Windi 语法
    presetAttributify(), // 属性模式：bg="blue-500"
    presetIcons(), // 图标支持
  ],
});
