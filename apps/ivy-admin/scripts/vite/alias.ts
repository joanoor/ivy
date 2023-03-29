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
      find: '@shard',
      replacement: pathResolve('../../shared'),
    },
    {
      find: '@ivy/core',
      replacement: pathResolve('../../packages/core'),
    },
    {
      find: '@ivy/chart',
      replacement: pathResolve('../../packages/chart'),
    },
    {
      find: '@ivy/request',
      replacement: pathResolve('../../packages/request'),
    },
    {
      find: '@ivy/form',
      replacement: pathResolve('../../packages/form'),
    },
    {
      find: '@ivy/cache',
      replacement: pathResolve('../../packages/cache'),
    },
    {
      find: '@ivy/cipher',
      replacement: pathResolve('../../packages/cipher'),
    },
  ]
}
