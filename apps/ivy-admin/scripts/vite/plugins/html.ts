import { createHtmlPlugin } from 'vite-plugin-html'

export function configHtmlPlugin(env: ViteEnv, isBuild: boolean) {
  const { VITE_GLOB_APP_TITLE } = env

  return createHtmlPlugin({
    minify: isBuild,
    inject: {
      data: {
        title: VITE_GLOB_APP_TITLE,
        minaScript: `
        <!-- 1. 引入dayjs -->
        <script src="./js/dayjs.min.js"></script>
        <script src="./js/isLeapYear.js"></script>
        <script src="./js/quarterOfYear.min.js"></script>
      
        <!-- 2. 引入nprogress -->
        <script src="./js/nprogress.min.js"></script>
        <link href="./js/nprogress.min.css" rel="stylesheet" />
      
        <!-- 3. 引入gsap 3.11.1版本 -->
        <script src="./js/gsap.min.js"></script>
      
      
        <!-- 4. 引入打印 -->
        <script src="./js/print.js"></script>
      
        <!-- 5. 引入配置 -->
        <script src="./js/env.config.js"></script>
        `,
        minaConfigScript: `
        <!-- 引入gsap相关动画插件 3.11.1版本 -->
        <script src="./js/TextPlugin.min.js"></script>
        <script src="./js/ScrollTrigger.min.js"></script>
        <script src="./js/ScrollToPlugin.min.js"></script>
        <script src="./js/PixiPlugin.min.js"></script>
        <script src="./js/Observer.min.js"></script>
        <script src="./js/MotionPathPlugin.min.js"></script>
        <script src="./js/Flip.min.js"></script>
        <script src="./js/CSSRulePlugin.min.js"></script>
        <script src="./js/Draggable.min.js"></script>
        `,
      },
    },
  })
}
