import type { Alias } from 'vite'
import { pathResolve } from '../utils'

export function configAlias(): Alias[] {
  console.log(
    `我看下你===>`,
    pathResolve('src'),
    pathResolve('../../shared'),
    pathResolve('src/views')
  )
  return [
    {
      find: '@',
      replacement: pathResolve('src'),
    },
    {
      find: '@shared',
      replacement: pathResolve('../../shared'),
    },
    {
      find: '@scripts',
      replacement: pathResolve('../../scripts'),
    },
    {
      find: '@views',
      replacement: pathResolve('src/views'),
    },
  ]
}
