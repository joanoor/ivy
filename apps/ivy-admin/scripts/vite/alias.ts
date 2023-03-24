import type { Alias } from 'vite'
import { pathResolve } from '../utils'

export function configAlias(): Alias[] {
  return [
    {
      find: '@',
      replacement: pathResolve('src'),
    },
    {
      find: '@views',
      replacement: pathResolve('src/views'),
    },
    {
      find: '@enums',
      replacement: pathResolve('src/enums'),
    },
    {
      find: '@utils',
      replacement: pathResolve('src/utils'),
    },
    {
      find: '@ivy/core',
      replacement: pathResolve('src/libs/core'),
    },
    {
      find: '@ivy/chart',
      replacement: pathResolve('src/libs/chart'),
    },
    {
      find: '@ivy/request',
      replacement: pathResolve('src/libs/request'),
    },
    {
      find: '@ivy/form',
      replacement: pathResolve('src/libs/form'),
    },
    {
      find: '@ivy/cache',
      replacement: pathResolve('src/libs/cache'),
    },
    {
      find: '@ivy/cipher',
      replacement: pathResolve('src/libs/cipher'),
    },
  ]
}
