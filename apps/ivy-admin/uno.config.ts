/**
 * unocss的配置文件，文件名也可以是uno.config.js, unocss.config.js, vite.config.js, svelte.config.js, astro.config.js, iles.config.js or nuxt.config.js (or .ts)
 *
 * 如果这里进行了配置，则无需在vite插件中在进行配置，只需要引入插件即可。参见：https://juejin.cn/post/7142466784971456548
 */
import { defineConfig, presetUno, presetIcons, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  theme: {
    colors: {
      primary: 'var(--primary-color)',
      dark_bg: 'var(--dark-bg)',
    },
  },
  shortcuts: [
    ['wh-full', 'w-full h-full'],
    ['f-c-c', 'flex justify-center items-center'],
    ['flex-col', 'flex flex-col'],
    ['text-ellipsis', 'truncate'],
    [
      'icon-btn',
      'text-16 inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-primary !outline-none',
    ],
  ],
  rules: [
    [/^bc-(.+)$/, ([, color]) => ({ 'border-color': `#${color}` })],
    [
      'card-shadow',
      {
        'box-shadow':
          '0 1px 2px -2px #00000029, 0 3px 6px #0000001f, 0 5px 12px 4px #00000017',
      },
    ],
  ],

  variants: [
    {
      match: s => {
        if (s.startsWith('i-')) {
          return {
            matcher: s,
            selector: s => {
              return s.startsWith('.') ? `${s.slice(1)},${s}` : s
            },
          }
        }
      },
    },
  ],
})
