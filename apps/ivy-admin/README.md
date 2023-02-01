# IvyAdmin

## 简介
基于Vue3 + typescript + pinia + element-plus + unocss

### unocss在vite中的使用
1. 安装
   ```sh
   $ npm i -D unocss 
   # 注意：这里是放到devDependencies中

   $ npm i @unocss/reset
   ```
2. vite中添加unocss plugin
   ```ts
   import { defineConfig } from 'vite'
   import vue from '@vitejs/plugin-vue'
   import unocss from 'unocss/vite'

   // https://vitejs.dev/config/
   export default defineConfig({
     plugins: [vue(), unocss()]
   })
   ```
3. main中引入
   ```ts
   import '@unocss/reset/normalize.css'
   /** 
   *  项目内的样式，
   *  注意：最好放在重置样式后，uno.css前
   */
   import './style.css'
   /** 引入uno.css，不引入不生效 */
   import 'uno.css'
   ```
4. 新增uno.config.ts（文件名也可以是uno.config.js, unocss.config.js, vite.config.js, svelte.config.js, astro.config.js, iles.config.js or nuxt.config.js (or .ts)）
   ```ts
   import { defineConfig, presetAttributify, presetUno, presetIcons } from 'unocss'

   export default defineConfig({
     presets: [presetUno(), presetAttributify(), presetIcons({scale: 1.2, warn: true})],
     shortcuts: [
      ['wh-full', 'w-full h-full'],
      ['f-c-c', 'flex justify-center items-center'],
      ['flex-col', 'flex flex-col'],
      ['text-ellipsis', 'truncate'],
      ['icon-btn', 'text-16 inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-primary !outline-none']
     ],
     rules: [
      [/^bc-(.+)$/, ([, color]) => ({ 'border-color': `#${color}` })],
      ['card-shadow', { 'box-shadow': '0 1px 2px -2px #00000029, 0 3px 6px #0000001f, 0 5px 12px 4px #00000017' }],
     ],
     theme: {
       colors: {
        primary: 'var(--primary-color)',
        dark_bg: 'var(--dark-bg)',
       },
     },
   })

   ```

### 项目中svg引入的几种方式
1. 如果是Iconify集合或者自定义的集合，只需要在enabledCollections中添加上集合名称
   ```ts
   Components({
      resolvers: [
        IconsResolver({
          enabledCollections: ['ant-design', 'ep', 'carbon'],
          customCollections: ['iemp'],
          // prefix:'i' 这里不填，默认就是i
        }),
        ElementPlusResolver(),
      ],
   }),
   Icons({
     autoInstall: true, // 当import图标的时候，会自动检测并安装图标集，不引入则不会自动下载
     customCollections: {
      // 自定义图标集合
       iemp: FileSystemIconLoader(pathResolve('src/assets/icons'), svg =>
        svg.replace(/^<svg /, '<svg fill="currentColor" ')
       ),
     },
   }),
   ```
   然后项目中直接调用，（前缀是i）例如：{prefix}-{collection}-{icon}
   ```vue
   <template>
     <el-icon size="16">
       <i-carbon-3d-software style="color: green" />
     <el-icon>
     <el-icon size="80">
       <i-iemp-avatar />
     <el-icon>
   </template>
   ```
2. 使用了unplugin-svg-component插件，下面的carbon_esmission_monitor是svg文件的名称
   ```vue
   <template>
     <el-icon size="16">
       <SvgIcon name="carbon_esmission_monitor"></SvgIcon>
     </el-icon>
   </template>
   ```
