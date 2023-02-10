import type { App } from 'vue'
import SvgIcon from '~virtual/svg-component'

export function registerGlobComp(app: App) {
  // app.use(Input).use(Button).use(Layout).use(VXETable);
  app.component(SvgIcon.name, SvgIcon)
}
