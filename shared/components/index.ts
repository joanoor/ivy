import type { App } from 'vue'
import SvgIcon from '~virtual/svg-component'

export function registerGlobComp(app: App) {
  app.component(SvgIcon.name, SvgIcon)
  // app.use(Input).use(Button).use(Layout).use(VXETable);
}
