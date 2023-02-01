import { App } from 'vue'
import SvgIcon from '~virtual/svg-component'

export function setupPlugins(app: App<Element>) {
  app.component(SvgIcon.name, SvgIcon)
}
