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
        <script src="./js/cdnjs/dayjs.min.js"></script>
        <script src="./js/cdnjs/isLeapYear.js"></script>
        <script src="./js/cdnjs/quarterOfYear.min.js"></script>
      
        <!-- 2. 引入nprogress -->
        <script src="./js/cdnjs/nprogress.min.js"></script>
        <link href="./js/cdnjs/nprogress.min.css" rel="stylesheet" />
      
        <!-- 3. 引入gsap 3.11.1版本 -->
        <script src="./js/cdnjs/gsap.min.js"></script>
      
      
        <!-- 4. 引入打印 -->
        <script src="./js/print.js"></script>
      
        <!-- 5. 引入配置 -->
        <script src="./js/env.config.js"></script>
        `,
        minaConfigScript: `
        <!-- 引入gsap相关动画插件 3.11.1版本 -->
        <script src="./js/cdnjs/TextPlugin.min.js"></script>
        <script src="./js/cdnjs/ScrollTrigger.min.js"></script>
        <script src="./js/cdnjs/ScrollToPlugin.min.js"></script>
        <script src="./js/cdnjs/PixiPlugin.min.js"></script>
        <script src="./js/cdnjs/Observer.min.js"></script>
        <script src="./js/cdnjs/MotionPathPlugin.min.js"></script>
        <script src="./js/cdnjs/Flip.min.js"></script>
        <script src="./js/cdnjs/CSSRulePlugin.min.js"></script>
        <script src="./js/cdnjs/Draggable.min.js"></script>
        `,
      },
    },
  })
}
